// Response caching middleware
import { cache } from 'hono/cache'

// Cache search results for 5 minutes
export const searchCache = cache({
  cacheName: 'beatport-search',
  cacheControl: 'max-age=300', // 5 minutes
})

// Cache catalog data for 1 hour
export const catalogCache = cache({
  cacheName: 'beatport-catalog', 
  cacheControl: 'max-age=3600', // 1 hour
})

// Cache auth responses briefly
export const authCache = cache({
  cacheName: 'beatport-auth',
  cacheControl: 'max-age=60', // 1 minute
})