// BeatportAPI class - extracted from main index.ts
import { TokenManager, type StoredToken } from './token-manager';

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

  constructor(username?: string, password?: string, clientId?: string) {
    this.username = username;
    this.password = password;
    this.clientId = clientId;
    this.tokenManager = new TokenManager();
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
    
    try {
      // Fetch the docs page HTML
      const docsResponse = await fetch('https://api.beatport.com/v4/docs/');
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
          const jsResponse = await fetch(scriptUrl);
          const jsContent = await jsResponse.text();
          
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
      // Step 1: Login to get session cookies
      const loginResponse = await fetch(`${this.baseUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
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
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
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
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
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
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
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
    const tokenEnv = process.env.BEATPORT_TOKEN;
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

    const response = await fetch(`${this.baseUrl}/auth/o/introspect/`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Introspection failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Make authenticated API requests
  async makeRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
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

    return await this.makeRequest(`/catalog/tracks/?${searchParams.toString()}`);
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

    return await this.makeRequest(`/catalog/releases/?${searchParams.toString()}`);
  }

  // Get current access token
  getAccessToken(): string | undefined {
    return this.accessToken;
  }
}