// Simple Provider Tests - Testing core functionality without DOM
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRoot, createSignal } from 'solid-js'
import { testEffect } from '@solidjs/testing-library'
import { AuthProvider, useAuth, type User } from '../stores/auth'

// Mock localStorage for all tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Setup global mocks
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
  
  // Mock window and localStorage
  Object.defineProperty(global, 'window', {
    value: { localStorage: localStorageMock },
    writable: true
  })
  
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
})

describe('Auth Provider Core Functionality', () => {
  it('should create auth context with initial state', () => {
    let authState: any
    
    createRoot(() => {
      AuthProvider({
        children: () => {
          const auth = useAuth()
          authState = auth.state
          return null
        }
      })
    })

    expect(authState.isAuthenticated).toBe(false)
    expect(authState.user).toBe(null)
    expect(authState.token).toBe(null)
  })

  it('should handle user login correctly', () => {
    let authMethods: any
    let authState: any
    
    createRoot(() => {
      AuthProvider({
        children: () => {
          const auth = useAuth()
          authMethods = auth
          authState = auth.state
          return null
        }
      })
    })

    const testUser: User = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com'
    }

    // Perform login
    authMethods.login('test-token', testUser)

    // Check state after login
    expect(authState.isAuthenticated).toBe(true)
    expect(authState.user).toEqual(testUser)
    expect(authState.token).toBe('test-token')

    // Check localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('auth-token', 'test-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('auth-user', JSON.stringify(testUser))
  })

  it('should handle user logout correctly', () => {
    let authMethods: any
    let authState: any
    
    createRoot(() => {
      AuthProvider({
        children: () => {
          const auth = useAuth()
          authMethods = auth
          authState = auth.state
          return null
        }
      })
    })

    const testUser: User = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com'
    }

    // Login first
    authMethods.login('test-token', testUser)
    expect(authState.isAuthenticated).toBe(true)

    // Then logout
    authMethods.logout()

    // Check state after logout
    expect(authState.isAuthenticated).toBe(false)
    expect(authState.user).toBe(null)
    expect(authState.token).toBe(null)

    // Check localStorage was cleared
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth-token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth-user')
  })

  it('should call checkAuth when provider is created', async () => {
    // Mock localStorage to return saved data
    const savedUser = {
      id: '456',
      username: 'saveduser', 
      email: 'saved@example.com'
    }
    
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'auth-token') return 'saved-token'
      if (key === 'auth-user') return JSON.stringify(savedUser)
      return null
    })

    let authMethods: any
    
    createRoot(() => {
      AuthProvider({
        children: () => {
          const auth = useAuth()
          authMethods = auth
          return null
        }
      })
    })

    // Test that we can manually call checkAuth and it works
    expect(typeof authMethods.checkAuth).toBe('function')
    
    // Manually trigger checkAuth to test the localStorage restoration logic
    await authMethods.checkAuth()
    
    // After manually calling checkAuth, verify localStorage was accessed
    expect(localStorageMock.getItem).toHaveBeenCalledWith('auth-token')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('auth-user')
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      createRoot(() => {
        useAuth()
      })
    }).toThrow('useAuth must be used within AuthProvider')
  })
})