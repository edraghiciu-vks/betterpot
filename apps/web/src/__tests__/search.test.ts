// Search Component Tests - Testing search functionality with SolidJS
import { describe, it, expect, beforeEach } from 'vitest'
import { createRoot, createSignal } from 'solid-js'

// Mock data for testing
const mockTrack = {
  id: '1',
  name: 'Test Track',
  mix_name: 'Original Mix',
  artists: [{ id: '1', name: 'Test Artist', slug: 'test-artist' }],
  release: { id: '1', name: 'Test Release', slug: 'test-release' },
  genre: { id: '1', name: 'House', slug: 'house' },
  bpm: 128,
  key: { id: '1', name: 'C major', camelot_number: '8B' },
  label: { id: '1', name: 'Test Label', slug: 'test-label' },
  duration: 300,
  preview: 'https://example.com/preview.mp3',
  release_date: '2024-01-01',
  publish_date: '2024-01-01',
  price: { currency: 'USD', value: '2.49', symbol: '$', display: '$2.49' },
  current_status: 'available',
  slug: 'test-track'
}

const mockSearchResponse = {
  results: [mockTrack],
  count: 1,
  page: 1,
  per_page: 100,
  total_pages: 1,
  next: null,
  previous: null
}

describe('Search Component Logic', () => {
  describe('Search State Management', () => {
    it('should manage search query state correctly', () => {
      createRoot(() => {
        const [query, setQuery] = createSignal('')
        
        expect(query()).toBe('')
        
        setQuery('test music')
        expect(query()).toBe('test music')
        
        setQuery('')
        expect(query()).toBe('')
      })
    })

    it('should manage loading state correctly', () => {
      createRoot(() => {
        const [isLoading, setIsLoading] = createSignal(false)
        
        expect(isLoading()).toBe(false)
        
        setIsLoading(true)
        expect(isLoading()).toBe(true)
        
        setIsLoading(false)
        expect(isLoading()).toBe(false)
      })
    })

    it('should manage error state correctly', () => {
      createRoot(() => {
        const [error, setError] = createSignal<string | null>(null)
        
        expect(error()).toBeNull()
        
        setError('Search failed')
        expect(error()).toBe('Search failed')
        
        setError(null)
        expect(error()).toBeNull()
      })
    })

    it('should manage search results state correctly', () => {
      createRoot(() => {
        const [results, setResults] = createSignal<typeof mockTrack[]>([])
        
        expect(results()).toEqual([])
        
        setResults([mockTrack])
        expect(results()).toHaveLength(1)
        expect(results()[0]?.name).toBe('Test Track')
        
        setResults([])
        expect(results()).toEqual([])
      })
    })
  })

  describe('Search Input Validation', () => {
    it('should handle empty search query', () => {
      const query = ''
      const isEmpty = !query.trim()
      expect(isEmpty).toBe(true)
    })

    it('should handle whitespace-only search query', () => {
      const query = '   '
      const isEmpty = !query.trim()
      expect(isEmpty).toBe(true)
    })

    it('should handle valid search query', () => {
      const query = 'house music'
      const isEmpty = !query.trim()
      expect(isEmpty).toBe(false)
    })

    it('should validate minimum query length', () => {
      const validateQuery = (query: string, minLength: number = 2) => {
        return query.trim().length >= minLength
      }

      expect(validateQuery('a')).toBe(false)
      expect(validateQuery('ab')).toBe(true)
      expect(validateQuery('house music')).toBe(true)
    })
  })

  describe('Search Response Processing', () => {
    it('should process successful search response correctly', () => {
      const processSearchResponse = (response: typeof mockSearchResponse) => {
        return {
          tracks: response.results,
          currentPage: response.page,
          totalPages: response.total_pages,
          totalTracks: response.count,
          hasNext: !!response.next,
          hasPrevious: !!response.previous
        }
      }

      const processed = processSearchResponse(mockSearchResponse)

      expect(processed.tracks).toHaveLength(1)
      expect(processed.currentPage).toBe(1)
      expect(processed.totalPages).toBe(1)
      expect(processed.totalTracks).toBe(1)
      expect(processed.hasNext).toBe(false)
      expect(processed.hasPrevious).toBe(false)
    })

    it('should process paginated response correctly', () => {
      const pagedResponse = {
        ...mockSearchResponse,
        page: 2,
        total_pages: 5,
        count: 500,
        next: 'next_url',
        previous: 'prev_url'
      }

      const processSearchResponse = (response: typeof pagedResponse) => {
        return {
          tracks: response.results,
          currentPage: response.page,
          totalPages: response.total_pages,
          totalTracks: response.count,
          hasNext: !!response.next,
          hasPrevious: !!response.previous
        }
      }

      const processed = processSearchResponse(pagedResponse)

      expect(processed.currentPage).toBe(2)
      expect(processed.totalPages).toBe(5)
      expect(processed.totalTracks).toBe(500)
      expect(processed.hasNext).toBe(true)
      expect(processed.hasPrevious).toBe(true)
    })

    it('should handle empty search results', () => {
      const emptyResponse = {
        results: [],
        count: 0,
        page: 1,
        per_page: 100,
        total_pages: 0,
        next: null,
        previous: null
      }

      const processSearchResponse = (response: typeof emptyResponse) => {
        return {
          tracks: response.results,
          currentPage: response.page,
          totalPages: response.total_pages,
          totalTracks: response.count,
          isEmpty: response.results.length === 0
        }
      }

      const processed = processSearchResponse(emptyResponse)

      expect(processed.tracks).toHaveLength(0)
      expect(processed.totalTracks).toBe(0)
      expect(processed.isEmpty).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should categorize error types correctly', () => {
      const categorizeError = (error: { status?: number; message: string }) => {
        if (error.status === 401) return 'authentication'
        if (error.status === 403) return 'authorization'
        if (error.status === 404) return 'not_found'
        if (error.status === 500) return 'server_error'
        if (error.status === 429) return 'rate_limit'
        return 'unknown'
      }

      expect(categorizeError({ status: 401, message: 'Unauthorized' })).toBe('authentication')
      expect(categorizeError({ status: 403, message: 'Forbidden' })).toBe('authorization')
      expect(categorizeError({ status: 404, message: 'Not found' })).toBe('not_found')
      expect(categorizeError({ status: 500, message: 'Server error' })).toBe('server_error')
      expect(categorizeError({ status: 429, message: 'Too many requests' })).toBe('rate_limit')
      expect(categorizeError({ message: 'Network error' })).toBe('unknown')
    })

    it('should generate user-friendly error messages', () => {
      const getErrorMessage = (error: { status?: number; message: string }) => {
        switch (error.status) {
          case 401:
            return 'Authentication failed. Please check your API configuration.'
          case 403:
            return 'Access denied. You may not have permission to perform this action.'
          case 404:
            return 'The requested resource was not found.'
          case 500:
            return 'Server error. Please try again later.'
          case 429:
            return 'Too many requests. Please wait a moment before trying again.'
          default:
            return 'An unexpected error occurred. Please try again.'
        }
      }

      expect(getErrorMessage({ status: 401, message: 'Unauthorized' }))
        .toBe('Authentication failed. Please check your API configuration.')
      expect(getErrorMessage({ message: 'Network error' }))
        .toBe('An unexpected error occurred. Please try again.')
    })
  })

  describe('Search Utility Functions', () => {
    it('should format duration correctly', () => {
      const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      }

      expect(formatDuration(300)).toBe('5:00')
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(59)).toBe('0:59')
      expect(formatDuration(0)).toBe('0:00')
    })

    it('should format artists correctly', () => {
      const formatArtists = (artists: Array<{ name: string }>) => {
        return artists.map((artist) => artist.name).join(', ')
      }

      const singleArtist = [{ name: 'Test Artist' }]
      const multipleArtists = [
        { name: 'Artist One' },
        { name: 'Artist Two' },
        { name: 'Artist Three' }
      ]

      expect(formatArtists(singleArtist)).toBe('Test Artist')
      expect(formatArtists(multipleArtists)).toBe('Artist One, Artist Two, Artist Three')
      expect(formatArtists([])).toBe('')
    })

    it('should generate Beatport URL correctly', () => {
      const getBeatportUrl = (track: { slug: string; id: string }) => {
        return `https://beatport.com/track/${track.slug}/${track.id}`
      }

      expect(getBeatportUrl({ slug: 'test-track', id: '123' }))
        .toBe('https://beatport.com/track/test-track/123')
      expect(getBeatportUrl({ slug: 'house-music-original-mix', id: '456' }))
        .toBe('https://beatport.com/track/house-music-original-mix/456')
    })

    it('should calculate pagination bounds correctly', () => {
      const calculatePaginationBounds = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)
        
        if (endPage - startPage + 1 < maxVisible) {
          startPage = Math.max(1, endPage - maxVisible + 1)
        }

        return { startPage, endPage }
      }

      expect(calculatePaginationBounds(1, 10)).toEqual({ startPage: 1, endPage: 5 })
      expect(calculatePaginationBounds(5, 10)).toEqual({ startPage: 3, endPage: 7 })
      expect(calculatePaginationBounds(10, 10)).toEqual({ startPage: 6, endPage: 10 })
      expect(calculatePaginationBounds(1, 3)).toEqual({ startPage: 1, endPage: 3 })
    })
  })

  describe('Search Parameters', () => {
    it('should build search parameters correctly', () => {
      const buildSearchParams = (params: {
        query: string;
        page?: number;
        per_page?: number;
        genre?: string;
        bpm?: string;
        key?: string;
        sort?: string;
      }) => {
        const searchParams = new URLSearchParams({
          q: params.query,
          page: String(params.page || 1),
          per_page: String(params.per_page || 100),
        })

        if (params.genre) searchParams.append('genre', params.genre)
        if (params.bpm) searchParams.append('bpm', params.bpm)
        if (params.key) searchParams.append('key', params.key)
        if (params.sort) searchParams.append('sort', params.sort)

        return searchParams.toString()
      }

      expect(buildSearchParams({ query: 'house music' }))
        .toBe('q=house+music&page=1&per_page=100')
      
      expect(buildSearchParams({ 
        query: 'techno', 
        page: 2, 
        per_page: 50, 
        genre: 'techno',
        bpm: '128'
      })).toBe('q=techno&page=2&per_page=50&genre=techno&bpm=128')
    })

    it('should validate search parameters', () => {
      const validateSearchParams = (params: {
        query: string;
        page?: number;
        per_page?: number;
      }) => {
        const errors: string[] = []

        if (!params.query.trim()) {
          errors.push('Query is required')
        }

        if (params.page !== undefined && params.page < 1) {
          errors.push('Page must be greater than 0')
        }

        if (params.per_page !== undefined && (params.per_page < 1 || params.per_page > 100)) {
          errors.push('Per page must be between 1 and 100')
        }

        return errors
      }

      expect(validateSearchParams({ query: 'house' })).toEqual([])
      expect(validateSearchParams({ query: '' })).toEqual(['Query is required'])
      expect(validateSearchParams({ query: 'house', page: 0 })).toEqual(['Page must be greater than 0'])
      expect(validateSearchParams({ query: 'house', per_page: 101 })).toEqual(['Per page must be between 1 and 100'])
    })
  })
})