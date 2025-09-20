// Bun API Server - Main Entry Point
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { searchRoutes } from './routes/search'
import { catalogRoutes } from './routes/catalog'

const app = new Hono()

// Middleware
app.use('/*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Routes
app.route('/auth', authRoutes)
app.route('/search', searchRoutes)
app.route('/catalog', catalogRoutes)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

const port = parseInt(process.env.PORT || '8001')

// Log startup information in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log(`🎵 Beatport API Server starting on port ${port}`)
}

export default {
  port,
  fetch: app.fetch,
}