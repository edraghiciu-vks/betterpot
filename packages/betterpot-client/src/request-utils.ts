// High-performance request utilities with caching for Bun
import type { BeatportAPIConfig } from './config';

/**
 * Cache entry structure
 */
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Request options for enhanced fetch
 */
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData | URLSearchParams;
  timeout?: number;
  retries?: number;
  cacheKey?: string;
  skipCache?: boolean;
  signal?: AbortSignal;
  redirect?: 'follow' | 'error' | 'manual';
}

/**
 * High-performance request manager with caching and rate limiting
 */
export class RequestManager {
  private cache = new Map<string, CacheEntry>();
  private requestQueue: Array<() => Promise<void>> = [];
  private activeRequests = 0;
  private lastRequestTime = 0;
  private config: Required<BeatportAPIConfig>;

  constructor(config: Required<BeatportAPIConfig>) {
    this.config = config;
    
    // Clean up expired cache entries every minute
    setInterval(() => this.cleanupCache(), 60000);
  }

  /**
   * Enhanced fetch with caching, retries, and rate limiting
   */
  async fetch<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = options.cacheKey || `${options.method || 'GET'}:${url}`;
    
    // Check cache first (unless explicitly skipped)
    if (this.config.enableCache && !options.skipCache) {
      const cachedData = this.getFromCache<T>(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    // Rate limiting
    if (this.config.enableRateLimit) {
      await this.rateLimit();
    }

    // Execute request with retries
    const response = await this.executeWithRetries(url, options);
    const data = await response.json() as T;

    // Cache successful responses
    if (this.config.enableCache && response.ok) {
      this.setCache(cacheKey, data, this.config.cacheTTL);
    }

    return data;
  }

  /**
   * Execute request with retry logic and exponential backoff
   */
  private async executeWithRetries(url: string, options: RequestOptions): Promise<Response> {
    const maxRetries = options.retries ?? this.config.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const timeout = options.timeout ?? this.config.timeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestOptions: RequestOptions & { signal?: AbortSignal } = {
          method: options.method || 'GET',
          body: options.body,
          redirect: options.redirect || 'follow',
          signal: controller.signal,
          headers: {
            'User-Agent': this.config.userAgent,
            ...options.headers,
          },
        };

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        // If request was successful or client error (4xx), don't retry
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }

        // Server error (5xx) - prepare for retry
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors or last attempt
        if (attempt === maxRetries || (error as any).name === 'TypeError') {
          break;
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await this.sleep(backoffDelay);
      }
    }

    throw new Error(`Request failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Rate limiting implementation
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const minInterval = 1000 / this.config.rateLimit; // ms between requests

    if (this.lastRequestTime > 0) {
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < minInterval) {
        await this.sleep(minInterval - timeSinceLastRequest);
      }
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemoryUsage: this.estimateCacheSize(),
    };
  }

  /**
   * Estimate cache memory usage (rough approximation)
   */
  private estimateCacheSize(): number {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.data).length * 2;
      size += 16; // timestamp + ttl
    }
    return size;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Request deduplication utility to prevent duplicate concurrent requests
 */
export class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Execute a request, reusing the result if the same request is already in progress
   */
  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is already in progress, return the existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Create new request promise
    const requestPromise = requestFn().finally(() => {
      // Clean up when request completes
      this.pendingRequests.delete(key);
    });

    // Store the promise
    this.pendingRequests.set(key, requestPromise);

    return requestPromise;
  }

  /**
   * Clear all pending requests (useful for cleanup)
   */
  clear(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get currently pending request keys
   */
  getPendingKeys(): string[] {
    return Array.from(this.pendingRequests.keys());
  }
}