// Search routes - Proxy to Beatport with caching
import { Hono } from 'hono'
import { BeatportAPI } from '@betterpot/betterpot-client'
import type { SearchTracksResponse } from '@betterpot/shared-types'

const search = new Hono()

// Search tracks
search.get('/tracks', async (c) => {
  try {
    const query = c.req.query('q')
    if (!query) {
      return c.json({ error: 'Query parameter "q" is required' }, 400)
    }

    const page = parseInt(c.req.query('page') || '1')
    const per_page = Math.min(parseInt(c.req.query('per_page') || '100'), 100) // Max 100 per page
    const genre = c.req.query('genre')
    const bpm = c.req.query('bpm')
    const key = c.req.query('key')
    const sort = c.req.query('sort')
    
    // Initialize Beatport API
    const api = new BeatportAPI(
      process.env.BEATPORT_USERNAME,
      process.env.BEATPORT_PASSWORD,
      process.env.BEATPORT_CLIENT_ID
    )

    // Try to initialize with existing token first
    const hasValidToken = await api.initialize()
    
    // If no valid token, authenticate
    if (!hasValidToken) {
      if (process.env.BEATPORT_TOKEN) {
        await api.authenticateWithManualToken()
      } else if (process.env.BEATPORT_USERNAME && process.env.BEATPORT_PASSWORD) {
        await api.authenticateWithPassword()
      } else {
        return c.json({ 
          error: 'Beatport authentication not configured. Please set BEATPORT_USERNAME/BEATPORT_PASSWORD or BEATPORT_TOKEN environment variables.' 
        }, 500)
      }
    }

    // Search tracks with parameters
    const searchResult = await api.searchTracks({
      query,
      page,
      per_page,
      genre,
      bpm,
      key,
      sort
    })

    // Format response to match our API types
    const response: SearchTracksResponse = {
      results: (searchResult as any).results || [],
      count: (searchResult as any).count || 0,
      next: (searchResult as any).next,
      previous: (searchResult as any).previous,
      page,
      per_page,
      total_pages: Math.ceil(((searchResult as any).count || 0) / per_page)
    }

    return c.json(response)
  } catch (error) {
    return c.json({ 
      error: 'Failed to search tracks', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500)
  }
})

// Search releases
search.get('/releases', async (c) => {
  const query = c.req.query('q')
  
  // TODO: Implement release search
  return c.json({
    message: 'Release search endpoint',
    params: { query }
  })
})

// Search artists
search.get('/artists', async (c) => {
  const query = c.req.query('q')
  
  // TODO: Implement artist search
  return c.json({
    message: 'Artist search endpoint',
    params: { query }
  })
})

export { search as searchRoutes }