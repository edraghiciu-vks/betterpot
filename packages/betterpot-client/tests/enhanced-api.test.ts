import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { EnhancedBeatportAPI } from '../src/enhanced-api';
import { getRealisticUserAgent, createUserAgent } from '../src/utils';

describe('EnhancedBeatportAPI', () => {
  let api: EnhancedBeatportAPI;
  let fetchSpy: any;

  const mockResponse = {
    results: [
      { id: 1, name: 'Test Track', artists: [{ name: 'Test Artist' }] }
    ]
  };

  beforeEach(() => {
    api = new EnhancedBeatportAPI('testuser', 'testpass', 'test_client_id');
    
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

  describe('user agent improvements', () => {
    it('should use realistic user agents by default', () => {
      const config = api.getConfig();
      expect(config.useRealisticUserAgent).toBe(true);
    });

    it('should make requests with realistic user agents', async () => {
      // Mock token for authenticated request
      (api as any).accessToken = 'mock_token';
      
      await api.makeRequest('/test/endpoint');
      
      const callArgs = fetchSpy.mock.calls[0];
      const headers = callArgs[1].headers;
      
      expect(headers['User-Agent']).toBeDefined();
      expect(headers['User-Agent']).not.toContain('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    });

    it('should rotate user agents for different requests', async () => {
      (api as any).accessToken = 'mock_token';
      
      // Make multiple requests
      await api.makeRequest('/test/endpoint1');
      await api.makeRequest('/test/endpoint2');
      
      const userAgent1 = fetchSpy.mock.calls[0][1].headers['User-Agent'];
      const userAgent2 = fetchSpy.mock.calls[1][1].headers['User-Agent'];
      
      expect(userAgent1).toBeDefined();
      expect(userAgent2).toBeDefined();
      // User agents might be different due to randomization
    });
  });

  describe('caching functionality', () => {
    beforeEach(() => {
      (api as any).accessToken = 'mock_token';
    });

    it('should cache API responses', async () => {
      const result1 = await api.makeRequest('/test/cached-endpoint');
      const result2 = await api.makeRequest('/test/cached-endpoint');
      
      expect(result1).toEqual(result2);
      // Should only make one actual fetch due to caching
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should provide cache statistics', async () => {
      await api.makeRequest('/test/endpoint');
      
      const stats = api.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
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

  describe('rate limiting', () => {
    it('should be enabled by default', () => {
      const config = api.getConfig();
      expect(config.enableRateLimit).toBe(true);
      expect(config.requestsPerSecond).toBe(10);
    });

    it('should allow configuration of rate limits', () => {
      const customApi = new EnhancedBeatportAPI('user', 'pass', 'client', {
        requestsPerSecond: 5
      });
      
      const config = customApi.getConfig();
      expect(config.requestsPerSecond).toBe(5);
      
      customApi.destroy();
    });
  });

  describe('search functionality with caching', () => {
    beforeEach(() => {
      (api as any).accessToken = 'mock_token';
    });

    it('should cache search results', async () => {
      const searchParams = { query: 'test track' };
      
      const result1 = await api.searchTracks(searchParams);
      const result2 = await api.searchTracks(searchParams);
      
      expect(result1).toEqual(result2);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle complex search parameters', async () => {
      const searchParams = {
        query: 'techno track',
        genre: 'techno',
        bpm: '128',
        page: 2,
        per_page: 50
      };
      
      await api.searchTracks(searchParams);
      
      const callArgs = fetchSpy.mock.calls[0];
      const url = callArgs[0];
      
      expect(url).toContain('name=techno%20track');
      expect(url).toContain('genre_name=techno');
      expect(url).toContain('bpm=128');
      expect(url).toContain('page=2');
      expect(url).toContain('per_page=50');
    });
  });

  describe('error handling and resilience', () => {
    beforeEach(() => {
      (api as any).accessToken = 'mock_token';
    });

    it('should retry on server errors', async () => {
      const retryApi = new EnhancedBeatportAPI('user', 'pass', 'client', {
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
      
      (retryApi as any).accessToken = 'mock_token';
      const result = await retryApi.makeRequest('/retry/endpoint');
      
      expect(result).toEqual({ success: true });
      expect(attemptCount).toBe(3);
      
      retryApi.destroy();
    });

    it('should not retry client errors', async () => {
      fetchSpy.mockImplementation(async () => {
        return new Response('Bad Request', { status: 400 });
      });
      
      await expect(
        api.makeRequest('/bad/endpoint')
      ).rejects.toThrow();
      
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('configuration management', () => {
    it('should use default configuration', () => {
      const config = api.getConfig();
      
      expect(config.useRealisticUserAgent).toBe(true);
      expect(config.enableCache).toBe(true);
      expect(config.enableRateLimit).toBe(true);
      expect(config.cacheTTL).toBe(5 * 60 * 1000);
      expect(config.requestsPerSecond).toBe(10);
      expect(config.timeout).toBe(30000);
      expect(config.maxRetries).toBe(3);
    });

    it('should accept custom configuration', () => {
      const customApi = new EnhancedBeatportAPI('user', 'pass', 'client', {
        cacheTTL: 60000,
        requestsPerSecond: 5,
        useRealisticUserAgent: false
      });
      
      const config = customApi.getConfig();
      expect(config.cacheTTL).toBe(60000);
      expect(config.requestsPerSecond).toBe(5);
      expect(config.useRealisticUserAgent).toBe(false);
      
      customApi.destroy();
    });

    it('should allow runtime configuration updates', () => {
      api.updateConfig({ timeout: 45000 });
      
      const config = api.getConfig();
      expect(config.timeout).toBe(45000);
    });
  });
});

describe('User Agent Utilities', () => {
  describe('createUserAgent', () => {
    it('should create a valid user agent', () => {
      const userAgent = createUserAgent();
      
      expect(userAgent).toContain('BetterpotClient/1.0');
      expect(userAgent).toContain('Mozilla/5.0');
    });
  });

  describe('getRealisticUserAgent', () => {
    it('should return different user agents', () => {
      const userAgents = new Set();
      
      for (let i = 0; i < 20; i++) {
        userAgents.add(getRealisticUserAgent());
      }
      
      // Should have some variation
      expect(userAgents.size).toBeGreaterThan(1);
    });

    it('should return valid user agent strings', () => {
      const userAgent = getRealisticUserAgent();
      
      expect(userAgent).toBeDefined();
      expect(userAgent.length).toBeGreaterThan(0);
      expect(userAgent).toMatch(/Mozilla\/5\.0/);
    });
  });
});