// Search routes - Proxy to Beatport with caching
import { Hono } from 'hono'

const search = new Hono()

// Search tracks
search.get('/tracks', async (c) => {
  const query = c.req.query('q')
  const genre = c.req.query('genre')
  const bpm = c.req.query('bpm')
  
  // TODO: Implement search with beatport-client package
  return c.json({ 
    message: 'Track search endpoint',
    params: { query, genre, bpm }
  })
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