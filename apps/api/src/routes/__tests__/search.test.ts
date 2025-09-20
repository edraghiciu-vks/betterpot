import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { Hono } from 'hono'
import { searchRoutes } from '../search'
import type { SearchTracksResponse } from '@betterpot/shared-types'

// Mock the BeatportAPI
const mockBeatportAPI = {
  initialize: mock(() => Promise.resolve(true)),
  authenticateWithPassword: mock(() => Promise.resolve()),
  authenticateWithManualToken: mock(() => Promise.resolve()),
  searchTracks: mock(() => Promise.resolve({
    results: [
      {
        id: '1',
        name: 'Test Track',
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
    ],
    count: 1,
    next: null,
    previous: null
  }))
}

// Mock the module
mock.module('@betterpot/betterpot-client', () => ({
  BeatportAPI: mock(() => mockBeatportAPI)
}))

describe('Search Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/search', searchRoutes)
    
    // Reset mocks
    mockBeatportAPI.initialize.mockClear()
    mockBeatportAPI.authenticateWithPassword.mockClear()
    mockBeatportAPI.authenticateWithManualToken.mockClear()
    mockBeatportAPI.searchTracks.mockClear()
    
    // Set default mock values
    mockBeatportAPI.initialize.mockResolvedValue(true)
    mockBeatportAPI.searchTracks.mockResolvedValue({
      results: [
        {
          id: '1',
          name: 'Test Track',
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
      ],
      count: 1,
      next: null,
      previous: null
    })
  })

  describe('GET /search/tracks', () => {
    it('should return tracks for valid search query', async () => {
      const req = new Request('http://localhost/search/tracks?q=house+music&page=1&per_page=10')
      const res = await app.fetch(req)
      const data = await res.json() as SearchTracksResponse

      expect(res.status).toBe(200)
      expect(data.results).toHaveLength(1)
      expect(data.results[0]?.name).toBe('Test Track')
      expect(data.page).toBe(1)
      expect(data.per_page).toBe(10)
      expect(data.total_pages).toBe(1)
      expect(data.count).toBe(1)
    })

    it('should return 400 for missing query parameter', async () => {
      const req = new Request('http://localhost/search/tracks')
      const res = await app.fetch(req)
      const data = await res.json() as { error: string }

      expect(res.status).toBe(400)
      expect(data.error).toBe('Query parameter "q" is required')
    })

    it('should handle pagination parameters correctly', async () => {
      const req = new Request('http://localhost/search/tracks?q=test&page=2&per_page=50')
      const res = await app.fetch(req)
      const data = await res.json() as SearchTracksResponse

      expect(res.status).toBe(200)
      expect(data.page).toBe(2)
      expect(data.per_page).toBe(50)
      expect(mockBeatportAPI.searchTracks).toHaveBeenCalledWith({
        query: 'test',
        page: 2,
        per_page: 50,
        genre: undefined,
        bpm: undefined,
        key: undefined,
        sort: undefined
      })
    })

    it('should limit per_page to maximum of 100', async () => {
      const req = new Request('http://localhost/search/tracks?q=test&per_page=200')
      const res = await app.fetch(req)
      const data = await res.json() as SearchTracksResponse

      expect(res.status).toBe(200)
      expect(data.per_page).toBe(100)
      expect(mockBeatportAPI.searchTracks).toHaveBeenCalledWith({
        query: 'test',
        page: 1,
        per_page: 100,
        genre: undefined,
        bpm: undefined,
        key: undefined,
        sort: undefined
      })
    })

    it('should handle optional filter parameters', async () => {
      const req = new Request('http://localhost/search/tracks?q=test&genre=house&bpm=128&key=C&sort=popularity')
      const res = await app.fetch(req)

      expect(res.status).toBe(200)
      expect(mockBeatportAPI.searchTracks).toHaveBeenCalledWith({
        query: 'test',
        page: 1,
        per_page: 100,
        genre: 'house',
        bpm: '128',
        key: 'C',
        sort: 'popularity'
      })
    })

    it('should handle authentication when no existing token', async () => {
      mockBeatportAPI.initialize.mockResolvedValue(false)
      
      // Mock environment variables
      const originalEnv = process.env
      process.env.BEATPORT_USERNAME = 'testuser'
      process.env.BEATPORT_PASSWORD = 'testpass'

      const req = new Request('http://localhost/search/tracks?q=test')
      const res = await app.fetch(req)

      expect(res.status).toBe(200)
      expect(mockBeatportAPI.authenticateWithPassword).toHaveBeenCalled()
      
      // Restore environment
      process.env = originalEnv
    })

    it('should handle manual token authentication', async () => {
      mockBeatportAPI.initialize.mockResolvedValue(false)
      
      // Mock environment variables
      const originalEnv = process.env
      process.env.BEATPORT_TOKEN = '{"access_token":"test_token","expires_in":3600}'

      const req = new Request('http://localhost/search/tracks?q=test')
      const res = await app.fetch(req)

      expect(res.status).toBe(200)
      expect(mockBeatportAPI.authenticateWithManualToken).toHaveBeenCalled()
      
      // Restore environment
      process.env = originalEnv
    })

    it('should return 500 when authentication is not configured', async () => {
      mockBeatportAPI.initialize.mockResolvedValue(false)
      
      // Mock empty environment
      const originalEnv = process.env
      process.env = {}

      const req = new Request('http://localhost/search/tracks?q=test')
      const res = await app.fetch(req)
      const data = await res.json() as { error: string }

      expect(res.status).toBe(500)
      expect(data.error).toContain('Beatport authentication not configured')
      
      // Restore environment
      process.env = originalEnv
    })

    it('should handle API errors gracefully', async () => {
      mockBeatportAPI.searchTracks.mockRejectedValue(new Error('API Error'))

      const req = new Request('http://localhost/search/tracks?q=test')
      const res = await app.fetch(req)
      const data = await res.json() as { error: string; details: string }

      expect(res.status).toBe(500)
      expect(data.error).toBe('Failed to search tracks')
      expect(data.details).toBe('API Error')
    })

    it('should calculate total_pages correctly', async () => {
      mockBeatportAPI.searchTracks.mockResolvedValue({
        results: [],
        count: 150
      } as any)

      const req = new Request('http://localhost/search/tracks?q=test&per_page=20')
      const res = await app.fetch(req)
      const data = await res.json() as SearchTracksResponse

      expect(res.status).toBe(200)
      expect(data.total_pages).toBe(8) // Math.ceil(150 / 20)
      expect(data.count).toBe(150)
    })

    it('should handle empty results', async () => {
      mockBeatportAPI.searchTracks.mockResolvedValue({
        results: [],
        count: 0,
        next: null,
        previous: null
      })

      const req = new Request('http://localhost/search/tracks?q=nonexistent')
      const res = await app.fetch(req)
      const data = await res.json() as SearchTracksResponse

      expect(res.status).toBe(200)
      expect(data.results).toHaveLength(0)
      expect(data.count).toBe(0)
      expect(data.total_pages).toBe(0)
    })
  })
})