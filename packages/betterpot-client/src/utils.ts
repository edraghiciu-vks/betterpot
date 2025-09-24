// Simple platform detection utilities
declare const process: any;
declare const Bun: any;
declare const require: any;

/**
 * Simple user agent generation with better cross-platform compatibility
 */
export function createUserAgent(): string {
  // Base user agent that works across platforms
  return 'Mozilla/5.0 (compatible; BetterpotClient/1.0; +https://github.com/edraghiciu-vks/betterpot)';
}

/**
 * Get a realistic user agent from a predefined pool
 */
export function getRealisticUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    createUserAgent() // Our custom user agent
  ];
  
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
}

/**
 * Simple storage interface
 */
export interface SimpleStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  delete(key: string): void;
}

/**
 * Create a simple in-memory storage for tokens and cache
 */
export function createMemoryStorage(): SimpleStorage {
  const storage = new Map<string, string>();
  
  return {
    get: (key: string) => storage.get(key) || null,
    set: (key: string, value: string) => storage.set(key, value),
    delete: (key: string) => storage.delete(key)
  };
}

/**
 * Simple cache implementation
 */
export class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  
  constructor(ttl?: number) {
    if (ttl) this.defaultTTL = ttl;
    
    // Clean expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expires });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
  
  size(): number {
    return this.cache.size;
  }
}

/**
 * Simple rate limiter
 */
export class RateLimiter {
  private lastRequest = 0;
  private interval: number;
  
  constructor(requestsPerSecond: number) {
    this.interval = 1000 / requestsPerSecond;
  }
  
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.interval) {
      const waitTime = this.interval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }
    
    this.lastRequest = Date.now();
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}