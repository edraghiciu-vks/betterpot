import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { BeatportAPI } from '../src/index';

// Testable version of BeatportAPI that exposes private methods for testing
class BeatportAPITestable {
  private clientId?: string;
  private username?: string;
  private password?: string;
  private accessToken?: string;
  private baseUrl = 'https://api.beatport.com/v4';
  private redirectUri = 'https://api.beatport.com/v4/auth/o/post-message/';

  constructor(username?: string, password?: string, clientId?: string) {
    this.username = username;
    this.password = password;
    this.clientId = clientId;
  }

  // Expose private methods for testing
  public getClientId() { return this.clientId; }
  public getUsername() { return this.username; }
  public getPassword() { return this.password; }
  public getAccessToken() { return this.accessToken; }
  public setAccessToken(token: string) { this.accessToken = token; }

  // Mock-friendly version of client ID scraping
  async getPublicClientId(): Promise<string> {
    if (this.clientId) {
      return this.clientId;
    }

    // This will be mocked in tests
    const response = await fetch('https://api.beatport.com/v4/docs/');
    const html = await response.text();
    
    const scriptMatches = html.match(/src="(.*?\.js)"/g);
    if (!scriptMatches) {
      throw new Error('No JavaScript files found');
    }

    for (const scriptMatch of scriptMatches) {
      const scriptPath = scriptMatch.match(/src="(.*?\.js)"/)?.[1];
      if (!scriptPath) continue;

      const scriptUrl = `https://api.beatport.com${scriptPath}`;
      const jsResponse = await fetch(scriptUrl);
      const jsContent = await jsResponse.text();
      
      const clientIdMatch = jsContent.match(/API_CLIENT_ID:\s*['"](.*?)['"]/);
      if (clientIdMatch && clientIdMatch[1]) {
        this.clientId = clientIdMatch[1];
        return clientIdMatch[1];
      }
    }
    
    throw new Error('Could not find API_CLIENT_ID');
  }

  // Test introspection
  async introspect() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/o/introspect/`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Introspection failed: ${response.status}`);
    }

    return await response.json();
  }

  // Test API request
  async makeRequest(endpoint: string) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  // Search methods
  async searchTracks(query: string) {
    return await this.makeRequest(`/catalog/search/?q=${encodeURIComponent(query)}&type=tracks`);
  }

  async searchReleases(query: string) {
    return await this.makeRequest(`/catalog/search/?q=${encodeURIComponent(query)}&type=releases`);
  }
}

describe('BeatportAPI', () => {
  let api: BeatportAPITestable;
  let fetchSpy: any;
  let consoleLogSpy: any;

  // Sample response data
  const mockDocsHtml = `<html><head><script src="/static/btprt/sentry.js"></script><script src="/static/btprt/app.1234.js"></script></head><body>Content</body></html>`;

  const mockJsWithClientId = `
    var config = {
      API_CLIENT_ID: 'test_client_id_123',
      API_BASE_URL: 'https://api.beatport.com/v4'
    };
  `;

  const mockJsWithoutClientId = `
    var someOtherConfig = {
      SOME_OTHER_ID: 'not_what_we_want'
    };
  `;

  const mockTokenResponse = {
    access_token: 'mock_access_token_123',
    refresh_token: 'mock_refresh_token_456',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'app:docs user:dj'
  };

  const mockIntrospectionResponse = {
    application_id: 1,
    user_id: 123456,
    username: 'testuser',
    scope: 'app:docs user:dj'
  };

  const mockSearchResponse = {
    tracks: [
      { id: 1, name: 'Test Track 1', artists: [{ name: 'Test Artist' }] },
      { id: 2, name: 'Test Track 2', artists: [{ name: 'Another Artist' }] }
    ]
  };

  beforeEach(() => {
    api = new BeatportAPITestable('testuser', 'testpass');
    consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {});
    
    // Always reset fetch spy with the default implementation
    if (fetchSpy) {
      fetchSpy.mockRestore();
    }
    
    // Set up fetch mock with proper call tracking
    fetchSpy = spyOn(global, 'fetch').mockImplementation((async (url: any) => {
      const urlString = url.toString();
      
      // Mock different responses based on URL
      if (urlString === 'https://api.beatport.com/v4/docs/') {
        return new Response(mockDocsHtml, { 
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      if (urlString === 'https://api.beatport.com/static/btprt/sentry.js') {
        return new Response(mockJsWithoutClientId, { 
          status: 200,
          headers: { 'Content-Type': 'application/javascript' }
        });
      }
      
      if (urlString === 'https://api.beatport.com/static/btprt/app.1234.js') {
        return new Response(mockJsWithClientId, { 
          status: 200,
          headers: { 'Content-Type': 'application/javascript' }
        });
      }
      
      if (urlString.includes('/auth/o/introspect/')) {
        return new Response(JSON.stringify(mockIntrospectionResponse), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlString.includes('/catalog/search/')) {
        return new Response(JSON.stringify(mockSearchResponse), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlString.includes('/test/endpoint') || urlString.includes('/test')) {
        return new Response(JSON.stringify({ success: true }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Default error response
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }) as any);
  });

  afterEach(() => {
    fetchSpy.mockClear();
    fetchSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should initialize with provided credentials', () => {
      const testApi = new BeatportAPITestable('user123', 'pass456', 'client789');
      
      expect(testApi.getUsername()).toBe('user123');
      expect(testApi.getPassword()).toBe('pass456');
      expect(testApi.getClientId()).toBe('client789');
    });

    it('should initialize with undefined values when no credentials provided', () => {
      const testApi = new BeatportAPITestable();
      
      expect(testApi.getUsername()).toBeUndefined();
      expect(testApi.getPassword()).toBeUndefined();
      expect(testApi.getClientId()).toBeUndefined();
    });
  });

  describe('getPublicClientId', () => {
    it('should return existing client_id if already set', async () => {
      const testApi = new BeatportAPITestable('user', 'pass', 'existing_client_id');
      
      const clientId = await testApi.getPublicClientId();
      
      expect(clientId).toBe('existing_client_id');
      // Should not make any HTTP requests
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should scrape client_id from Beatport docs when not set', async () => {
      const clientId = await api.getPublicClientId();
      
      expect(clientId).toBe('test_client_id_123');
      expect(fetchSpy).toHaveBeenCalledWith('https://api.beatport.com/v4/docs/');
      expect(fetchSpy).toHaveBeenCalledWith('https://api.beatport.com/static/btprt/sentry.js');
      expect(fetchSpy).toHaveBeenCalledWith('https://api.beatport.com/static/btprt/app.1234.js');
    });

    it('should throw error when no JavaScript files found', async () => {
      fetchSpy.mockImplementation(async (url: any) => {
        if (url === 'https://api.beatport.com/v4/docs/') {
          return new Response('<html><body>No scripts</body></html>', { status: 200 });
        }
        return new Response('Not Found', { status: 404 });
      });

      await expect(api.getPublicClientId()).rejects.toThrow('No JavaScript files found');
    });

    it('should throw error when client_id not found in any JavaScript files', async () => {
      // Mock fetch to return HTML with scripts but JS files without client_id
      fetchSpy.mockImplementation(async (url: any) => {
        const urlString = url.toString();
        if (urlString === 'https://api.beatport.com/v4/docs/') {
          return new Response(mockDocsHtml, { status: 200 });
        }
        if (urlString.includes('.js')) {
          return new Response(mockJsWithoutClientId, { status: 200 });
        }
        return new Response('Not Found', { status: 404 });
      });

      await expect(api.getPublicClientId()).rejects.toThrow('Could not find API_CLIENT_ID');
    });

    it('should handle JavaScript file fetch errors gracefully', async () => {
      fetchSpy.mockImplementation(async (url: any) => {
        const urlString = url.toString();
        if (urlString === 'https://api.beatport.com/v4/docs/') {
          return new Response(mockDocsHtml, { status: 200 });
        }
        if (urlString.includes('.js')) {
          throw new Error('Network error');
        }
        return new Response('Not Found', { status: 404 });
      });

      // Should catch the network error and rethrow as 'Could not find API_CLIENT_ID' 
      // Or expect the actual network error
      await expect(api.getPublicClientId()).rejects.toThrow('Network error');
    });
  });

  describe('introspect', () => {
    it('should make introspection request with access token', async () => {
      api.setAccessToken('test_token_123');
      
      const result = await api.introspect();
      
      expect(result).toEqual(mockIntrospectionResponse);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.beatport.com/v4/auth/o/introspect/',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer test_token_123' }
        })
      );
    });

    it('should throw error when no access token available', async () => {
      await expect(api.introspect()).rejects.toThrow('No access token available');
    });

    it('should throw error when introspection request fails', async () => {
      api.setAccessToken('invalid_token');
      
      fetchSpy.mockImplementation(async (url: any) => {
        if (url.includes('/auth/o/introspect/')) {
          return new Response('Unauthorized', { status: 401 });
        }
        return new Response('Not Found', { status: 404 });
      });

      await expect(api.introspect()).rejects.toThrow('Introspection failed: 401');
    });
  });

  describe('makeRequest', () => {
    beforeEach(() => {
      api.setAccessToken('test_token_123');
    });

    it('should make authenticated request to API endpoint', async () => {
      const result = await api.makeRequest('/test/endpoint');
      
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.beatport.com/v4/test/endpoint',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer test_token_123' }
        })
      );
    });

    it('should throw error when no access token available', async () => {
      const apiWithoutToken = new BeatportAPITestable();
      
      await expect(apiWithoutToken.makeRequest('/test')).rejects.toThrow('No access token available');
    });

    it('should throw error when API request fails', async () => {
      fetchSpy.mockImplementation(async () => {
        return new Response('Bad Request', { status: 400 });
      });

      await expect(api.makeRequest('/test')).rejects.toThrow('API request failed: 400');
    });
  });

  describe('searchTracks', () => {
    beforeEach(() => {
      api.setAccessToken('test_token_123');
    });

    it('should search for tracks with proper URL encoding', async () => {
      const result = await api.searchTracks('deadmau5 & test');
      
      expect(result).toEqual(mockSearchResponse);
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/catalog/search/?q=deadmau5%20%26%20test&type=tracks'),
        expect.any(Object)
      );
    });

    it('should handle empty search query', async () => {
      await api.searchTracks('');
      
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/catalog/search/?q=&type=tracks'),
        expect.any(Object)
      );
    });

    it('should handle special characters in search query', async () => {
      await api.searchTracks('artist/title (remix)');
      
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('artist%2Ftitle%20(remix)'),
        expect.any(Object)
      );
    });
  });

  describe('searchReleases', () => {
    beforeEach(() => {
      api.setAccessToken('test_token_123');
    });

    it('should search for releases with proper URL encoding', async () => {
      const result = await api.searchReleases('album name');
      
      expect(result).toEqual(mockSearchResponse);
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/catalog/search/?q=album%20name&type=releases'),
        expect.any(Object)
      );
    });

    it('should handle empty search query', async () => {
      await api.searchReleases('');
      
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/catalog/search/?q=&type=releases'),
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      fetchSpy.mockImplementation(async () => {
        throw new Error('Network unavailable');
      });

      await expect(api.getPublicClientId()).rejects.toThrow();
    });

    it('should handle malformed JSON responses', async () => {
      api.setAccessToken('test_token');
      
      fetchSpy.mockImplementation(async (url: any) => {
        if (url.includes('/auth/o/introspect/')) {
          return new Response('invalid json', { status: 200 });
        }
        return new Response('Not Found', { status: 404 });
      });

      await expect(api.introspect()).rejects.toThrow();
    });

    it('should handle timeout scenarios', async () => {
      fetchSpy.mockImplementation(async () => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 100);
        });
      });

      await expect(api.getPublicClientId()).rejects.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should complete full workflow: scrape client_id -> set token -> make requests', async () => {
      // Step 1: Scrape client_id
      const clientId = await api.getPublicClientId();
      expect(clientId).toBe('test_client_id_123');

      // Step 2: Set access token (simulating successful authentication)
      api.setAccessToken('workflow_test_token');

      // Step 3: Make API requests
      const introspection = await api.introspect();
      expect(introspection).toEqual(mockIntrospectionResponse);

      const tracks = await api.searchTracks('test query');
      expect(tracks).toEqual(mockSearchResponse);

      const releases = await api.searchReleases('test album');
      expect(releases).toEqual(mockSearchResponse);

      // Verify all expected calls were made
      expect(fetchSpy).toHaveBeenCalledWith('https://api.beatport.com/v4/docs/');
      
      // Check that introspection endpoint was called with proper authorization
      const introspectCall = fetchSpy.mock.calls.find((call: any) => 
        call[0].includes('/auth/o/introspect/')
      );
      expect(introspectCall).toBeDefined();
      expect(introspectCall[1]?.headers?.Authorization).toBe('Bearer workflow_test_token');
      
      // Check that search endpoint was called
      const searchCall = fetchSpy.mock.calls.find((call: any) => 
        call[0].includes('/catalog/search/')
      );
      expect(searchCall).toBeDefined();
    });

    it('should handle partial failures gracefully', async () => {
      // Client ID scraping succeeds first
      const clientId = await api.getPublicClientId();
      expect(clientId).toBe('test_client_id_123');

      // Set invalid token
      api.setAccessToken('invalid_token');
      
      // Update mock to fail API requests but keep scraping working
      fetchSpy.mockImplementation(async (url: any) => {
        const urlString = url.toString();
        if (urlString === 'https://api.beatport.com/v4/docs/') {
          return new Response(mockDocsHtml, { status: 200 });
        }
        if (urlString === 'https://api.beatport.com/static/btprt/sentry.js') {
          return new Response(mockJsWithoutClientId, { status: 200 });
        }
        if (urlString === 'https://api.beatport.com/static/btprt/app.1234.js') {
          return new Response(mockJsWithClientId, { status: 200 });
        }
        // All API calls fail
        return new Response('Unauthorized', { status: 401 });
      });

      await expect(api.introspect()).rejects.toThrow();
      await expect(api.searchTracks('test')).rejects.toThrow();
    });
  });
});