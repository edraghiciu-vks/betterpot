// Authentication store - SolidJS Store
import { createContext, useContext, createSignal, createEffect } from 'solid-js'

export interface User {
  id: string
  username: string
  email: string
  name?: string
  first_name?: string | null
  last_name?: string
  dj_profile?: {
    id: string
    slug: string
    display_name: string
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  apiError: string | null
}

interface AuthContextType {
  state: AuthState
  fetchUserData: () => Promise<void>
  clearApiError: () => void
}

const AuthContext = createContext<AuthContextType>()

export function AuthProvider(props: { children: any }) {
  const [user, setUser] = createSignal<User | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)
  const [apiError, setApiError] = createSignal<string | null>(null)

  const state: AuthState = {
    get user() { return user() },
    get isLoading() { return isLoading() },
    get apiError() { return apiError() }
  }

  const fetchUserData = async () => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      console.log('Fetching user data from backend API...')
      
      // Call our backend API which handles Beatport authentication
      const response = await fetch('http://localhost:8001/auth/user')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const userData = await response.json()
      
      // Transform backend response to our User interface
      const transformedUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        dj_profile: userData.dj_profile
      }
      
      setUser(transformedUser)
      console.log('✅ User data loaded:', transformedUser.name || transformedUser.username)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }

  const clearApiError = () => {
    setApiError(null)
  }

  // Fetch user data on mount
  createEffect(() => {
    fetchUserData()
  })

  const contextValue: AuthContextType = {
    state,
    fetchUserData,
    clearApiError
  }

  // Return the context provider with proper SolidJS API
  return AuthContext.Provider({
    value: contextValue,
    get children() { return props.children }
  })
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}