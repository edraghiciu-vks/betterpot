// Enhanced BeatportAPI with improved headers and caching
import { TokenManager, type StoredToken } from './token-manager';
import { SimpleCache, RateLimiter, getRealisticUserAgent, createMemoryStorage, type SimpleStorage } from './utils';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface EnhancedBeatportConfig {
  /** Use realistic rotating User-Agent strings */
  useRealisticUserAgent?: boolean;
  /** Enable response caching */
  enableCache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Enable rate limiting */
  enableRateLimit?: boolean;
  /** Requests per second limit */
  requestsPerSecond?: number;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Max retry attempts */
  maxRetries?: number;
}

const DEFAULT_CONFIG: Required<EnhancedBeatportConfig> = {
  useRealisticUserAgent: true,
  enableCache: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  enableRateLimit: true,
  requestsPerSecond: 10,
  timeout: 30000, // 30 seconds
  maxRetries: 3
};

export class EnhancedBeatportAPI {
  private clientId?: string;
  private username?: string;
  private password?: string;
  private accessToken?: string;
  private baseUrl = 'https://api.beatport.com/v4';
  private redirectUri = 'https://api.beatport.com/v4/auth/o/post-message/';
  private tokenManager: TokenManager;
  private cache: SimpleCache;
  private rateLimiter: RateLimiter;
  private config: Required<EnhancedBeatportConfig>;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(username?: string, password?: string, clientId?: string, config?: Partial<EnhancedBeatportConfig>) {
    this.username = username;
    this.password = password;
    this.clientId = clientId;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.tokenManager = new TokenManager();
    this.cache = new SimpleCache(this.config.cacheTTL);
    this.rateLimiter = new RateLimiter(this.config.requestsPerSecond);
  }

  // Check for existing valid token first
  async initialize(): Promise<boolean> {
    const validToken = this.tokenManager.getValidToken();
    if (validToken) {
      this.accessToken = validToken.access_token;
      return true;
    }
    return false;
  }

  // Enhanced User-Agent generation
  private getUserAgent(): string {
    if (this.config.useRealisticUserAgent) {
      return getRealisticUserAgent();
    }
    return 'Mozilla/5.0 (compatible; BetterpotClient/1.0)';
  }

  // Enhanced fetch with caching, rate limiting, and retries
  private async enhancedFetch(url: string, options: RequestInit = {}, cacheKey?: string): Promise<any> {
    // Check cache first
    if (this.config.enableCache && cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Deduplicate concurrent requests
    const requestKey = `${options.method || 'GET'}:${url}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    // Rate limiting
    if (this.config.enableRateLimit) {
      await this.rateLimiter.waitIfNeeded();
    }

    // Create the request promise
    const requestPromise = this.executeWithRetries(url, options);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful responses
      if (this.config.enableCache && cacheKey && result) {
        this.cache.set(cacheKey, result, this.config.cacheTTL);
      }
      
      return result;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  // Execute request with retry logic
  private async executeWithRetries(url: string, options: RequestInit): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const requestOptions: RequestInit = {
          ...options,
          signal: controller.signal,
          headers: {
            'User-Agent': this.getUserAgent(),
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Connection': 'keep-alive',
            ...options.headers,
          },
        };

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          // Server errors (5xx) - retry
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on last attempt or client errors
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await this.sleep(backoffDelay);
      }
    }

    throw new Error(`Request failed after ${this.config.maxRetries + 1} attempts: ${lastError?.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Step 1: Scrape the public client_id from Beatport's docs
  async getPublicClientId(): Promise<string> {
    if (this.clientId) {
      return this.clientId;
    }
    
    // Use caching for client ID scraping
    const cachedClientId = this.cache.get<string>('client-id');
    if (cachedClientId) {
      this.clientId = cachedClientId;
      return cachedClientId;
    }

    try {
      // Fetch the docs page HTML
      const docsResponse = await fetch('https://api.beatport.com/v4/docs/', {
        headers: {
          'User-Agent': this.getUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      
      const docsHtml = await docsResponse.text();
      
      // Find JavaScript files in the HTML
      const scriptMatches = docsHtml.match(/src="(.*?\.js)"/g);
      
      if (!scriptMatches) {
        throw new Error('No JavaScript files found in docs page');
      }

      // Search each JS file for the API_CLIENT_ID
      for (const scriptMatch of scriptMatches) {
        const scriptPath = scriptMatch.match(/src="(.*?\.js)"/)?.[1];
        if (!scriptPath) continue;

        const scriptUrl = `https://api.beatport.com${scriptPath}`;
        
        try {
          const jsResponse = await fetch(scriptUrl, {
            headers: {
              'User-Agent': this.getUserAgent(),
              'Accept': 'application/javascript, */*',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Referer': 'https://api.beatport.com/v4/docs/',
              'DNT': '1',
              'Connection': 'keep-alive',
            }
          });
          
          const jsContent = await jsResponse.text();
          
          // Look for API_CLIENT_ID pattern
          const clientIdMatch = jsContent.match(/API_CLIENT_ID:\s*['"](.*?)['"]/);
          if (clientIdMatch && clientIdMatch[1]) {
            const clientId = clientIdMatch[1];
            this.clientId = clientId;
            
            // Cache the client ID for future use
            this.cache.set('client-id', clientId, 24 * 60 * 60 * 1000); // Cache for 24 hours
            
            return clientId;
          }
        } catch (jsError) {
          // Continue to next script if this one fails
          continue;
        }
      }
      
      throw new Error('Could not find API_CLIENT_ID in any JavaScript files');
    } catch (error) {
      throw new Error(`Failed to scrape client_id: ${error}`);
    }
  }

  // Make authenticated API requests with caching
  async makeRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    const cacheKey = `api:${endpoint}`;
    
    return this.enhancedFetch(
      `${this.baseUrl}${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      },
      cacheKey
    );
  }

  // Search tracks with enhanced parameters and caching
  async searchTracks(params: {
    query: string;
    page?: number;
    per_page?: number;
    genre?: string;
    bpm?: string;
    key?: string;
    sort?: string;
    artist?: string;
  }) {
    const searchParams = new URLSearchParams({
      name: params.query,
      per_page: String(params.per_page || 100),
      page: String(params.page || 1),
    });

    if (params.artist) {
      searchParams.append('artist_name', params.artist);
    }
    if (params.genre) searchParams.append('genre_name', params.genre);
    if (params.bpm) searchParams.append('bpm', params.bpm);
    if (params.key) searchParams.append('key_name', params.key);
    if (params.sort) searchParams.append('order_by', params.sort);

    const endpoint = `/catalog/tracks/?${searchParams.toString()}`;
    return this.makeRequest(endpoint);
  }

  // Search releases with caching
  async searchReleases(query: string) {
    const searchParams = new URLSearchParams({
      name: query,
      per_page: '100',
      page: '1',
    });

    if (query) {
      searchParams.append('artist_name', query);
    }

    const endpoint = `/catalog/releases/?${searchParams.toString()}`;
    return this.makeRequest(endpoint);
  }

  // Test the token by introspecting current user
  async introspect() {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    return this.enhancedFetch(
      `${this.baseUrl}/auth/o/introspect/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      },
      'introspect'
    );
  }

  // Get current access token
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size(),
      pendingRequests: this.pendingRequests.size
    };
  }

  // Clear all caches
  clearCache(): void {
    this.cache.clear();
  }

  // Update configuration
  updateConfig(newConfig: Partial<EnhancedBeatportConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.cache = new SimpleCache(this.config.cacheTTL);
    this.rateLimiter = new RateLimiter(this.config.requestsPerSecond);
  }

  // Get current configuration
  getConfig(): Required<EnhancedBeatportConfig> {
    return { ...this.config };
  }

  // Cleanup resources
  destroy(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}