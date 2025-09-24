import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { RequestManager, RequestDeduplicator } from '../src/request-utils';
import { DEFAULT_CONFIG } from '../src/config';

describe('RequestManager', () => {
  let requestManager: RequestManager;
  let fetchSpy: any;
  
  const mockResponse = { success: true, data: 'test' };
  
  beforeEach(() => {
    requestManager = new RequestManager(DEFAULT_CONFIG);
    
    // Mock global fetch
    fetchSpy = spyOn(global, 'fetch').mockImplementation(async (url: any, options: any) => {
      // Simulate successful response
      return new Response(JSON.stringify(mockResponse), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    requestManager.clearCache();
  });

  describe('fetch', () => {
    it('should make a successful request', async () => {
      const result = await requestManager.fetch('https://api.example.com/test');
      
      expect(result).toEqual(mockResponse);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String)
          })
        })
      );
    });

    it('should use custom headers', async () => {
      await requestManager.fetch('https://api.example.com/test', {
        headers: { 'Authorization': 'Bearer token' }
      });
      
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token',
            'User-Agent': expect.any(String)
          })
        })
      );
    });

    it('should cache successful responses', async () => {
      const cacheKey = 'test-cache';
      
      // First request
      const result1 = await requestManager.fetch('https://api.example.com/test', {
        cacheKey
      });
      
      // Second request should use cache
      const result2 = await requestManager.fetch('https://api.example.com/test', {
        cacheKey
      });
      
      expect(result1).toEqual(result2);
      expect(fetchSpy).toHaveBeenCalledTimes(1); // Only one actual fetch
    });

    it('should skip cache when requested', async () => {
      const cacheKey = 'test-cache';
      
      // First request
      await requestManager.fetch('https://api.example.com/test', { cacheKey });
      
      // Second request with skipCache should not use cache
      await requestManager.fetch('https://api.example.com/test', {
        cacheKey,
        skipCache: true
      });
      
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle timeout', async () => {
      const config = { ...DEFAULT_CONFIG, timeout: 100 };
      const timeoutRequestManager = new RequestManager(config);
      
      // Mock a slow response
      fetchSpy.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 200))
      );
      
      await expect(
        timeoutRequestManager.fetch('https://api.example.com/test')
      ).rejects.toThrow();
      
      timeoutRequestManager.clearCache();
    });

    it('should respect rate limiting', async () => {
      const config = { ...DEFAULT_CONFIG, rateLimit: 2 }; // 2 requests per second
      const rateLimitedManager = new RequestManager(config);
      
      const startTime = Date.now();
      
      await rateLimitedManager.fetch('https://api.example.com/test1');
      await rateLimitedManager.fetch('https://api.example.com/test2');
      await rateLimitedManager.fetch('https://api.example.com/test3');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should take at least 1 second for 3 requests at 2 req/s
      expect(duration).toBeGreaterThanOrEqual(1000);
      
      rateLimitedManager.clearCache();
    });

    it('should retry on server errors', async () => {
      const config = { ...DEFAULT_CONFIG, maxRetries: 2 };
      const retryManager = new RequestManager(config);
      
      let attemptCount = 0;
      fetchSpy.mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          return new Response('Server Error', { status: 500 });
        }
        return new Response(JSON.stringify(mockResponse), { status: 200 });
      });
      
      const result = await retryManager.fetch('https://api.example.com/test');
      
      expect(result).toEqual(mockResponse);
      expect(attemptCount).toBe(3); // Initial + 2 retries
      
      retryManager.clearCache();
    });

    it('should not retry on client errors', async () => {
      fetchSpy.mockImplementation(async () => {
        return new Response('Bad Request', { status: 400 });
      });
      
      await expect(
        requestManager.fetch('https://api.example.com/test')
      ).rejects.toThrow();
      
      expect(fetchSpy).toHaveBeenCalledTimes(1); // No retries for 4xx errors
    });
  });

  describe('cache management', () => {
    it('should provide cache statistics', () => {
      const stats = requestManager.getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(stats).toHaveProperty('totalMemoryUsage');
      expect(stats.size).toBe(0);
    });

    it('should clear cache', async () => {
      await requestManager.fetch('https://api.example.com/test', {
        cacheKey: 'test-key'
      });
      
      let stats = requestManager.getCacheStats();
      expect(stats.size).toBe(1);
      
      requestManager.clearCache();
      
      stats = requestManager.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should automatically clean expired cache entries', async () => {
      const config = { ...DEFAULT_CONFIG, cacheTTL: 10 }; // 10ms TTL
      const shortCacheManager = new RequestManager(config);
      
      await shortCacheManager.fetch('https://api.example.com/test', {
        cacheKey: 'short-lived'
      });
      
      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // This request should not use cache (expired)
      await shortCacheManager.fetch('https://api.example.com/test', {
        cacheKey: 'short-lived'
      });
      
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      
      shortCacheManager.clearCache();
    });
  });
});

describe('RequestDeduplicator', () => {
  let deduplicator: RequestDeduplicator;
  
  beforeEach(() => {
    deduplicator = new RequestDeduplicator();
  });
  
  afterEach(() => {
    deduplicator.clear();
  });

  describe('deduplicate', () => {
    it('should execute request function once for same key', async () => {
      let executionCount = 0;
      const requestFn = async () => {
        executionCount++;
        return { value: executionCount };
      };
      
      // Make multiple concurrent requests with same key
      const promises = [
        deduplicator.deduplicate('test-key', requestFn),
        deduplicator.deduplicate('test-key', requestFn),
        deduplicator.deduplicate('test-key', requestFn)
      ];
      
      const results = await Promise.all(promises);
      
      // All should return the same result
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
      expect(executionCount).toBe(1); // Function called only once
    });

    it('should execute different keys separately', async () => {
      let executionCount = 0;
      const requestFn = async () => {
        executionCount++;
        return { value: executionCount };
      };
      
      const result1 = await deduplicator.deduplicate('key1', requestFn);
      const result2 = await deduplicator.deduplicate('key2', requestFn);
      
      expect(result1).not.toEqual(result2);
      expect(executionCount).toBe(2);
    });

    it('should handle request failures', async () => {
      const errorFn = async () => {
        throw new Error('Request failed');
      };
      
      const promises = [
        deduplicator.deduplicate('error-key', errorFn),
        deduplicator.deduplicate('error-key', errorFn)
      ];
      
      await expect(Promise.all(promises)).rejects.toThrow('Request failed');
      
      // Key should be cleaned up after failure
      expect(deduplicator.getPendingKeys()).not.toContain('error-key');
    });

    it('should clean up completed requests', async () => {
      const requestFn = async () => ({ success: true });
      
      const promise = deduplicator.deduplicate('cleanup-key', requestFn);
      
      // Key should be pending
      expect(deduplicator.getPendingKeys()).toContain('cleanup-key');
      
      await promise;
      
      // Key should be cleaned up
      expect(deduplicator.getPendingKeys()).not.toContain('cleanup-key');
    });
  });

  describe('management methods', () => {
    it('should track pending keys', () => {
      const longRequest = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'done';
      };
      
      deduplicator.deduplicate('pending-key', longRequest);
      
      expect(deduplicator.getPendingKeys()).toContain('pending-key');
    });

    it('should clear all pending requests', () => {
      const longRequest = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'done';
      };
      
      deduplicator.deduplicate('key1', longRequest);
      deduplicator.deduplicate('key2', longRequest);
      
      expect(deduplicator.getPendingKeys().length).toBe(2);
      
      deduplicator.clear();
      
      expect(deduplicator.getPendingKeys().length).toBe(0);
    });
  });
});