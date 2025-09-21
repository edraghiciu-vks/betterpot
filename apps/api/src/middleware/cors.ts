// CORS middleware configuration
import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: (origin) => {
    // Allow localhost and your production domains
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    // Return the origin if it's allowed, or null if not
    if (!origin) return origin // Allow requests with no origin (like mobile apps)
    return allowedOrigins.includes(origin) ? origin : null
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
})