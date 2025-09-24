import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { BeatportAPI } from '../src/api';
import { DEFAULT_CONFIG } from '../src/config';

describe('BeatportAPI Integration', () => {
  let api: BeatportAPI;
  let fetchSpy: any;

  const mockResponse = {
    results: [
      { id: 1, name: 'Test Track', artists: [{ name: 'Test Artist' }] }
    ]
  };

  beforeEach(() => {
    api = new BeatportAPI('testuser', 'testpass', 'test_client_id');
    
    fetchSpy = spyOn(global, 'fetch').mockImplementation(async (url: any, options: any) => {
      const urlString = url.toString();
      
      if (urlString.includes('/catalog/')) {
        return new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlString.includes('/auth/o/introspect/')) {
        return new Response(JSON.stringify({ user_id: 123, username: 'testuser' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response('{}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    api.destroy();
  });

  describe('constructor and configuration', () => {
    it('should initialize with default configuration', () => {
      const config = api.getConfig();
      expect(config.userAgent).toContain('BetterpotClient');
      expect(config.enableCache).toBe(true);
      expect(config.enableRateLimit).toBe(true);
    });

    it('should accept custom configuration', () => {
      const customApi = new BeatportAPI('user', 'pass', 'client', {
        timeout: 60000,
        enableCache: false,
        userAgent: 'Custom/1.0'
      });
      
      const config = customApi.getConfig();
      expect(config.timeout).toBe(60000);
      expect(config.enableCache).toBe(false);
      expect(config.userAgent).toBe('Custom/1.0');
      
      customApi.destroy();
    });

    it('should update configuration at runtime', () => {
      api.updateConfig({ timeout: 45000, maxRetries: 5 });
      
      const config = api.getConfig();
      expect(config.timeout).toBe(45000);
      expect(config.maxRetries).toBe(5);
    });
  });

  describe('API methods with enhanced features', () => {
    beforeEach(() => {
      // Set a mock token for authenticated requests
      (api as any).accessToken = 'mock_token';
    });

    it('should make cached API requests', async () => {
      const result1 = await api.makeRequest('/test/endpoint');
      const result2 = await api.makeRequest('/test/endpoint');
      
      expect(result1).toEqual(result2);
      // Due to caching, only one fetch should have been made
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should deduplicate concurrent search requests', async () => {
      const searchPromises = [
        api.searchTracks({ query: 'test query' }),
        api.searchTracks({ query: 'test query' }),
        api.searchTracks({ query: 'test query' })
      ];
      
      const results = await Promise.all(searchPromises);
      
      // All results should be the same
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
      
      // Due to deduplication, only one fetch should have been made
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should use dynamic user agents', async () => {
      await api.makeRequest('/test/endpoint');
      
      const callArgs = fetchSpy.mock.calls[0];
      const headers = callArgs[1].headers;
      
      expect(headers['User-Agent']).toBeDefined();
      expect(headers['User-Agent']).toContain('BetterpotClient');
      expect(headers['User-Agent']).not.toContain('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    });

    it('should handle search with various parameters', async () => {
      const searchParams = {
        query: 'test track',
        genre: 'techno',
        bpm: '128',
        page: 2,
        per_page: 50
      };
      
      await api.searchTracks(searchParams);
      
      const callArgs = fetchSpy.mock.calls[0];
      const url = callArgs[0];
      
      expect(url).toContain('name=test%20track');
      expect(url).toContain('genre_name=techno');
      expect(url).toContain('bpm=128');
      expect(url).toContain('page=2');
      expect(url).toContain('per_page=50');
    });

    it('should handle release searches', async () => {
      const result = await api.searchReleases('test album');
      
      expect(result).toEqual(mockResponse);
      
      const callArgs = fetchSpy.mock.calls[0];
      const url = callArgs[0];
      
      expect(url).toContain('/catalog/releases/');
      expect(url).toContain('name=test%20album');
      expect(url).toContain('artist_name=test%20album');
    });
  });

  describe('cache management', () => {
    beforeEach(() => {
      (api as any).accessToken = 'mock_token';
    });

    it('should provide cache statistics', async () => {
      await api.makeRequest('/test/endpoint');
      
      const stats = api.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.keys.length).toBeGreaterThan(0);
      expect(stats.totalMemoryUsage).toBeGreaterThan(0);
    });

    it('should clear cache when requested', async () => {
      await api.makeRequest('/test/endpoint');
      
      let stats = api.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      
      api.clearCache();
      
      stats = api.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('error handling and resilience', () => {
    beforeEach(() => {
      (api as any).accessToken = 'mock_token';
    });

    it('should handle network timeouts gracefully', async () => {
      const timeoutApi = new BeatportAPI('user', 'pass', 'client', {
        timeout: 100 // Very short timeout
      });
      
      fetchSpy.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 200))
      );
      
      await expect(
        timeoutApi.makeRequest('/slow/endpoint')
      ).rejects.toThrow();
      
      timeoutApi.destroy();
    });

    it('should retry on server errors', async () => {
      const retryApi = new BeatportAPI('user', 'pass', 'client', {
        maxRetries: 2
      });
      
      let attemptCount = 0;
      fetchSpy.mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          return new Response('Server Error', { status: 500 });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      });
      
      const result = await retryApi.makeRequest('/retry/endpoint');
      
      expect(result).toEqual({ success: true });
      expect(attemptCount).toBe(3);
      
      retryApi.destroy();
    });
  });

  describe('resource cleanup', () => {
    it('should clean up resources on destroy', () => {
      const stats = api.getCacheStats();
      api.destroy();
      
      // After destroy, cache should be empty
      const newStats = api.getCacheStats();
      expect(newStats.size).toBe(0);
    });
  });
});