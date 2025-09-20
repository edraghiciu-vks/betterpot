// Beatport API service using the betterpot-client package
import { BeatportAPI } from '@betterpot/betterpot-client'

export interface BeatportUser {
  id: string
  username: string
  email: string
  first_name?: string | null
  last_name: string
  name: string // computed full name from API
  dj_profile?: {
    id: string
    slug: string
    display_name: string
  }
  email_confirmed: boolean
  enabled: boolean
  registration_date: string
  last_login?: string | null
}

export class ApiError extends Error {
  public status?: number
  public details?: string
  
  constructor(message: string, status?: number, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

interface PaginatedResponse<T> {
  count: number
  next?: string | null
  previous?: string | null
  results: T[]
}

class BeatportApiService {
  private api: BeatportAPI | null = null
  private isInitialized = false

  constructor() {
    // Initialize with credentials from Vite environment variables
    // These should be prefixed with VITE_ to be available in the browser
    const username = import.meta.env.VITE_BEATPORT_USERNAME
    const password = import.meta.env.VITE_BEATPORT_PASSWORD
    
    if (username && password) {
      this.api = new BeatportAPI(username, password)
    }
  }

  async ensureAuthenticated(): Promise<void> {
    if (!this.api) {
      throw new ApiError('Beatport API not configured. Please set VITE_BEATPORT_USERNAME and VITE_BEATPORT_PASSWORD in your .env file.')
    }

    if (!this.isInitialized) {
      // Try to use existing token first
      const hasValidToken = await this.api.initialize()
      
      if (!hasValidToken) {
        // Try to authenticate with password
        try {
          await this.api.authenticateWithPassword()
        } catch (error) {
          // Fall back to manual token if available (browser environment)
          try {
            const tokenEnv = import.meta.env.VITE_BEATPORT_TOKEN
            if (tokenEnv) {
              const tokenData = JSON.parse(tokenEnv)
              // Manually set the access token since we can't call authenticateWithManualToken in browser
              if (this.api && tokenData.access_token) {
                (this.api as any).accessToken = tokenData.access_token
              } else {
                throw new Error('Invalid token format')
              }
            } else {
              throw new Error('No manual token available')
            }
          } catch (manualError) {
            throw new ApiError(
              'Failed to authenticate with Beatport API. Please set VITE_BEATPORT_USERNAME and VITE_BEATPORT_PASSWORD, or VITE_BEATPORT_TOKEN in your .env file.',
              401,
              error instanceof Error ? error.message : String(error)
            )
          }
        }
      }
      
      this.isInitialized = true
    }
  }

  async getUserData(): Promise<BeatportUser> {
    try {
      await this.ensureAuthenticated()
      
      if (!this.api) {
        throw new ApiError('API not available')
      }

      // Fetch user account data from /v4/my/account/
      const response = await this.api.makeRequest('/my/account/') as PaginatedResponse<any>
      
      if (!response || !response.results || response.results.length === 0) {
        throw new ApiError('No user data found', 404)
      }

      const userData = response.results[0]
      
      // Transform API response to our interface
      const user: BeatportUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: userData.name, // API provides computed full name
        dj_profile: userData.dj_profile ? {
          id: userData.dj_profile.id,
          slug: userData.dj_profile.slug,
          display_name: userData.dj_profile.display_name
        } : undefined,
        email_confirmed: userData.email_confirmed,
        enabled: userData.enabled,
        registration_date: userData.registration_date,
        last_login: userData.last_login
      }

      return user
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle different types of API errors
      if (error instanceof Error) {
        const message = error.message
        
        if (message.includes('401') || message.includes('Unauthorized')) {
          throw new ApiError('Authentication failed. Please check your Beatport credentials.', 401, message)
        }
        
        if (message.includes('403') || message.includes('Forbidden')) {
          throw new ApiError('Access denied. Your account may not have the required permissions.', 403, message)
        }
        
        if (message.includes('404') || message.includes('Not Found')) {
          throw new ApiError('User data not found.', 404, message)
        }
        
        if (message.includes('429') || message.includes('Too Many Requests')) {
          throw new ApiError('Rate limit exceeded. Please try again later.', 429, message)
        }
        
        if (message.includes('500') || message.includes('Internal Server Error')) {
          throw new ApiError('Beatport server error. Please try again later.', 500, message)
        }
        
        throw new ApiError('Failed to fetch user data', 0, message)
      }
      
      throw new ApiError('Unknown error occurred while fetching user data')
    }
  }

  async searchTracks(params: {
    query: string;
    page?: number;
    per_page?: number;
    genre?: string;
    bpm?: string;
    key?: string;
    sort?: string;
  }) {
    try {
      const searchParams = new URLSearchParams({
        q: params.query,
        page: String(params.page || 1),
        per_page: String(params.per_page || 100),
      });

      if (params.genre) searchParams.append('genre', params.genre);
      if (params.bpm) searchParams.append('bpm', params.bpm);
      if (params.key) searchParams.append('key', params.key);
      if (params.sort) searchParams.append('sort', params.sort);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/search/tracks?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || 'Failed to search tracks',
          response.status,
          errorData.details || `HTTP ${response.status} ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Failed to search tracks',
        0,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async searchReleases(query: string) {
    try {
      await this.ensureAuthenticated()
      
      if (!this.api) {
        throw new ApiError('API not available')
      }

      return await this.api.searchReleases(query)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        'Failed to search releases',
        0,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  // Check if API is configured
  isConfigured(): boolean {
    return this.api !== null
  }

  // Get current authentication status
  isAuthenticated(): boolean {
    return this.isInitialized && this.api?.getAccessToken() !== undefined
  }
}

// Create a singleton instance
export const beatportApiService = new BeatportApiService()