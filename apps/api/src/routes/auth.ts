// Authentication routes - Beatport OAuth proxy
import { Hono } from 'hono'

const auth = new Hono()

// Start OAuth flow
auth.get('/login', async (c) => {
  const clientId = process.env.BEATPORT_CLIENT_ID
  const redirectUri = process.env.BEATPORT_REDIRECT_URI
  
  const authUrl = `https://api.beatport.com/v4/auth/o/authorize/?` +
    `response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
  
  return c.redirect(authUrl)
})

// Handle OAuth callback
auth.get('/callback', async (c) => {
  const code = c.req.query('code')
  
  if (!code) {
    return c.json({ error: 'No authorization code provided' }, 400)
  }
  
  // TODO: Exchange code for token and create JWT
  return c.json({ message: 'OAuth callback received', code })
})

// Refresh token
auth.post('/refresh', async (c) => {
  // TODO: Implement token refresh
  return c.json({ message: 'Token refresh endpoint' })
})

// Get current user info
auth.get('/me', async (c) => {
  // TODO: Get user info from JWT
  return c.json({ message: 'User info endpoint' })
})

export { auth as authRoutes }