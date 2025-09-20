// Authentication routes - Beatport OAuth proxy
import { Hono } from 'hono'
import { BeatportAPI } from '@betterpot/betterpot-client'

const auth = new Hono()

// Initialize Beatport API client
const initBeatportAPI = async () => {
  const username = process.env.BEATPORT_USERNAME
  const password = process.env.BEATPORT_PASSWORD
  
  if (!username || !password) {
    throw new Error('BEATPORT_USERNAME and BEATPORT_PASSWORD must be set in environment variables')
  }
  
  const api = new BeatportAPI(username, password)
  
  // Try to use existing token first
  const hasValidToken = await api.initialize()
  
  if (!hasValidToken) {
    // Authenticate if no valid token
    await api.authenticateWithPassword()
  }
  
  return api
}

// Get current user info from Beatport API
auth.get('/user', async (c) => {
  try {
    const api = await initBeatportAPI()
    
    // Fetch user account data
    const response = await api.makeRequest('/my/account/') as any
    
    if (!response) {
      return c.json({ error: 'No user data found' }, 404)
    }
    
    // Return cleaned user data
    return c.json({
      id: response.id,
      username: response.username,
      email: response.email,
      first_name: response.first_name,
      last_name: response.last_name,
      name: response.name,
      dj_profile: response.dj_profile,
      email_confirmed: response.email_confirmed,
      enabled: response.enabled,
      registration_date: response.registration_date,
      last_login: response.last_login
    })
  } catch (error) {
    return c.json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})

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

export { auth as authRoutes }