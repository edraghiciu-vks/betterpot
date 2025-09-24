// BeatportAPI class - extracted from main index.ts
import { TokenManager, type StoredToken } from './token-manager';
import { RequestManager, RequestDeduplicator, type RequestOptions } from './request-utils';
import { type BeatportAPIConfig, mergeConfig, getRandomUserAgent } from './config';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export class BeatportAPI {
  private clientId?: string;
  private username?: string;
  private password?: string;
  private accessToken?: string;
  private baseUrl = 'https://api.beatport.com/v4';
  private redirectUri = 'https://api.beatport.com/v4/auth/o/post-message/';
  private tokenManager: TokenManager;
  private requestManager: RequestManager;
  private deduplicator: RequestDeduplicator;
  private config: Required<BeatportAPIConfig>;

  constructor(username?: string, password?: string, clientId?: string, config?: Partial<BeatportAPIConfig>) {
    this.username = username;
    this.password = password;
    this.clientId = clientId;
    this.config = mergeConfig(config);
    this.tokenManager = new TokenManager();
    this.requestManager = new RequestManager(this.config);
    this.deduplicator = new RequestDeduplicator();
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

  // Step 1: Scrape the public client_id from Beatport's docs (like beets does)
  async getPublicClientId(): Promise<string> {
    if (this.clientId) {
      return this.clientId;
    }
    
    return this.deduplicator.deduplicate('get-client-id', async () => {
      try {
        // Fetch the docs page HTML with caching
        const docsHtml = await this.requestManager.fetch<string>('https://api.beatport.com/v4/docs/', {
          method: 'GET',
          cacheKey: 'docs-page',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          }
        }).then(response => {
          // Since we're expecting HTML, we need to handle it differently
          return fetch('https://api.beatport.com/v4/docs/', {
            headers: {
              'User-Agent': this.config.userAgent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
            }
          }).then(res => res.text());
        });
        
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
            const jsContent = await fetch(scriptUrl, {
              headers: {
                'User-Agent': getRandomUserAgent(), // Use random UA for each script request
                'Accept': 'application/javascript, */*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://api.beatport.com/v4/docs/',
                'DNT': '1',
                'Connection': 'keep-alive',
              }
            }).then(res => res.text());
            
            // Look for API_CLIENT_ID pattern
            const clientIdMatch = jsContent.match(/API_CLIENT_ID:\s*['"](.*?)['"]/);
            if (clientIdMatch && clientIdMatch[1]) {
              const clientId = clientIdMatch[1];
              this.clientId = clientId;
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
    });
  }

  // Method 1: Username/Password Authentication (like beets Method 1)
  async authenticateWithPassword(username?: string, password?: string): Promise<TokenResponse> {
    const user = username || this.username;
    const pass = password || this.password;
    
    if (!user || !pass) {
      throw new Error('Username and password are required');
    }

    const clientId = await this.getPublicClientId();

    // Create a session to maintain cookies across requests
    const cookies = new Map<string, string>();
    
    // Helper function to extract cookies from response
    const extractCookies = (response: Response) => {
      const setCookieHeaders = response.headers.getSetCookie?.() || [];
      setCookieHeaders.forEach(cookie => {
        const [nameValue] = cookie.split(';');
        if (nameValue) {
          const [name, value] = nameValue.split('=');
          if (name && value) {
            cookies.set(name.trim(), value.trim());
          }
        }
      });
    };

    // Helper function to format cookies for request
    const formatCookies = () => {
      return Array.from(cookies.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    };

    try {
      // Step 1: Login to get session cookies with enhanced headers
      const loginResponse = await fetch(`${this.baseUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': this.config.userAgent,
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
      }

      // Extract cookies from login response
      extractCookies(loginResponse);
      
      const loginData = await loginResponse.json() as any;
      
      if (!loginData.username || !loginData.email) {
        throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
      }

      // Step 2: Get authorization page to obtain auth code
      const authorizeUrl = new URL(`${this.baseUrl}/auth/o/authorize/`);
      authorizeUrl.searchParams.set('response_type', 'code');
      authorizeUrl.searchParams.set('client_id', clientId);
      authorizeUrl.searchParams.set('redirect_uri', this.redirectUri);

      const authorizeResponse = await fetch(authorizeUrl.toString(), {
        method: 'GET',
        headers: {
          'Cookie': formatCookies(),
          'User-Agent': this.config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
        },
        redirect: 'manual', // Don't follow redirects automatically
      });

      let authCode: string | null = null;

      if (authorizeResponse.status === 302) {
        // Redirect response - extract auth code from Location header
        const locationHeader = authorizeResponse.headers.get('location');
        
        if (locationHeader) {
          try {
            const redirectUrl = new URL(locationHeader, this.baseUrl);
            authCode = redirectUrl.searchParams.get('code');
          } catch (urlError) {
            // Continue with other methods if URL parsing fails
          }
        }
      } else if (authorizeResponse.status === 200) {
        // Sometimes the response is 200 with a form or page content
        const authorizeText = await authorizeResponse.text();
        
        // Look for auth code in the response body
        const codeMatch = authorizeText.match(/code[=:]\s*["']([^"']+)["']/i);
        if (codeMatch && codeMatch[1]) {
          authCode = codeMatch[1];
        } else {
          // Check if there's a form we need to submit
          const formMatch = authorizeText.match(/<form[^>]*action=["']([^"']+)["'][^>]*>/i);
          if (formMatch) {
            const formAction = formMatch[1];
            
            // Submit the authorization form
            const formResponse = await fetch(`${this.baseUrl}${formAction}`, {
              method: 'POST',
              headers: {
                'Cookie': formatCookies(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': this.config.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Referer': authorizeUrl.toString(),
              },
              body: new URLSearchParams({
                'allow': 'Authorize',
              }),
              redirect: 'manual',
            });

            if (formResponse.status === 302) {
              const formLocationHeader = formResponse.headers.get('location');
              
              if (formLocationHeader) {
                const formRedirectUrl = new URL(formLocationHeader, this.baseUrl);
                authCode = formRedirectUrl.searchParams.get('code');
              }
            }
          }
        }
      }

      if (!authCode) {
        throw new Error('Could not obtain authorization code automatically. Please use manual token method with BEATPORT_TOKEN environment variable.');
      }

      // Step 3: Exchange auth code for access token
      const tokenResponse = await fetch(`${this.baseUrl}/auth/o/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent,
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        body: new URLSearchParams({
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          client_id: clientId,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}\n${errorText}`);
      }

      const tokenData = await tokenResponse.json() as TokenResponse;
      this.accessToken = tokenData.access_token;
      
      // Save token for future use
      this.tokenManager.saveToken(tokenData);
      
      return tokenData;

    } catch (error) {
      throw error;
    }
  }

  // Method 2: Manual token extraction (like beets Method 2)
  async authenticateWithManualToken(): Promise<void> {
    // Try to load from environment
    let tokenEnv: string | undefined;
    try {
      tokenEnv = typeof process !== 'undefined' && process.env ? process.env.BEATPORT_TOKEN : undefined;
    } catch {
      tokenEnv = undefined;
    }
    
    if (tokenEnv) {
      try {
        const tokenData = JSON.parse(tokenEnv) as TokenResponse;
        this.accessToken = tokenData.access_token;
        return;
      } catch (error) {
        throw new Error('Invalid token format in BEATPORT_TOKEN environment variable');
      }
    }
    
    throw new Error('No manual token found. Please set BEATPORT_TOKEN environment variable with format: {"access_token":"...","expires_in":36000}');
  }

  // Test the token by introspecting current user
  async introspect() {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    return this.requestManager.fetch(`${this.baseUrl}/auth/o/introspect/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
      },
      cacheKey: 'introspect',
    });
  }

  // Make authenticated API requests
  async makeRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    return this.requestManager.fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
      },
      cacheKey: `api:${endpoint}`,
    });
  }

  // Search tracks with enhanced parameters and pagination
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
      name: params.query, // Use 'name' parameter for track name search
      per_page: String(params.per_page || 100),
      page: String(params.page || 1),
    });

    // Also search by artist name with the same query
    if (params.artist) {
      searchParams.append('artist_name', params.artist);
    }

    if (params.genre) searchParams.append('genre_name', params.genre);
    if (params.bpm) searchParams.append('bpm', params.bpm);
    if (params.key) searchParams.append('key_name', params.key);
    if (params.sort) searchParams.append('order_by', params.sort);

    const endpoint = `/catalog/tracks/?${searchParams.toString()}`;
    const cacheKey = `search:tracks:${JSON.stringify(params)}`;
    
    return this.deduplicator.deduplicate(cacheKey, () => 
      this.makeRequest(endpoint)
    );
  }

  // Search releases (example API usage)
  async searchReleases(query: string) {
    const searchParams = new URLSearchParams({
      name: query, // Use 'name' parameter for release name search
      per_page: '100',
      page: '1',
    });

    // Also search by artist name with the same query
    if (query) {
      searchParams.append('artist_name', query);
    }

    const endpoint = `/catalog/releases/?${searchParams.toString()}`;
    const cacheKey = `search:releases:${query}`;
    
    return this.deduplicator.deduplicate(cacheKey, () =>
      this.makeRequest(endpoint)
    );
  }

  // Get current access token
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  // Get cache statistics for monitoring and debugging
  getCacheStats() {
    return this.requestManager.getCacheStats();
  }

  // Clear all cached data
  clearCache(): void {
    this.requestManager.clearCache();
  }

  // Update configuration at runtime
  updateConfig(newConfig: Partial<BeatportAPIConfig>): void {
    this.config = mergeConfig({ ...this.config, ...newConfig });
    this.requestManager = new RequestManager(this.config);
  }

  // Get current configuration
  getConfig(): Required<BeatportAPIConfig> {
    return { ...this.config };
  }

  // Clean up resources
  destroy(): void {
    this.requestManager.clearCache();
    this.deduplicator.clear();
  }
}