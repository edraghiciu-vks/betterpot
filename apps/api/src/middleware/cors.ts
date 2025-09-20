// CORS middleware configuration
import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: (origin) => {
    // Allow localhost and your production domains
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      process.env.FRONTEND_URL
    ].filter(Boolean) as string[]
    
    // Return the origin if it's allowed, or undefined for requests with no origin
    if (!origin) return origin // Return undefined for no-origin requests
    if (allowedOrigins.includes(origin)) return origin
    return undefined // Reject unallowed origins
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: [
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Opener-Policy'
  ]
})

export const securityHeaders = async (c: any, next: any) => {
  c.header('Cross-Origin-Embedder-Policy', 'require-corp')
  c.header('Cross-Origin-Opener-Policy', 'same-origin')
  await next()
}