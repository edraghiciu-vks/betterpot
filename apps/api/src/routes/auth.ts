// Authentication routes - Beatport OAuth proxy
import { Hono } from 'hono'
import { BeatportAPI } from '@betterpot/betterpot-client'

const auth = new Hono()

// Initialize Beatport API client
const initBeatportAPI = async () => {
  const username = process.env.BEATPORT_USERNAME
  const password = process.env.BEATPORT_PASSWORD
  
  console.log('🔑 Environment check:')
  console.log('  Username:', username ? `${username.substring(0, 3)}***` : 'NOT SET')
  console.log('  Password:', password ? '***' : 'NOT SET')
  
  if (!username || !password) {
    throw new Error('BEATPORT_USERNAME and BEATPORT_PASSWORD must be set in environment variables')
  }
  
  const api = new BeatportAPI(username, password)
  
  // Try to use existing token first
  console.log('🔄 Attempting to initialize with existing token...')
  const hasValidToken = await api.initialize()
  console.log('🎫 Has valid token:', hasValidToken)
  
  if (!hasValidToken) {
    // Authenticate if no valid token
    console.log('🔐 No valid token, authenticating with password...')
    await api.authenticateWithPassword()
    console.log('✅ Authentication completed')
  }
  
  return api
}

// Get current user info from Beatport API
auth.get('/user', async (c) => {
  try {
    console.log('🔍 Starting user data fetch...')
    const api = await initBeatportAPI()
    console.log('✅ BeatportAPI initialized successfully')
    
    // Fetch user account data
    console.log('📡 Making request to /my/account/')
    const response = await api.makeRequest('/my/account/') as any
    console.log('📥 Raw response from Beatport:', JSON.stringify(response, null, 2))
    
    if (!response) {
      return c.json({ error: 'No user data found' }, 404)
    }
    
    // Beatport API returns the user object directly, not in a results array
    const userData = response
    
    // Return cleaned user data
    return c.json({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      name: userData.name,
      dj_profile: userData.dj_profile,
      email_confirmed: userData.email_confirmed,
      enabled: userData.enabled,
      registration_date: userData.registration_date,
      last_login: userData.last_login
    })
  } catch (error) {
    console.error('Failed to fetch user data:', error)
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