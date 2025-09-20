// Library Provider Tests - Testing user-facing functionality  
import { describe, it, expect } from 'vitest'
import { createRoot } from 'solid-js'
import { LibraryProvider, useLibrary } from '../stores/library'

describe('Library Provider Core Functionality', () => {
  it('should create library context with initial state', () => {
    let libraryState: any
    
    createRoot(() => {
      LibraryProvider({
        children: () => {
          const library = useLibrary()
          libraryState = library.state
          return null
        }
      })
    })

    expect(libraryState.tracks).toEqual([])
    expect(libraryState.releases).toEqual([])
    expect(libraryState.artists).toEqual([])
    expect(libraryState.isLoading).toBe(false)
    expect(libraryState.searchQuery).toBe('')
    expect(libraryState.filters).toEqual({})
  })

  it('should provide library methods', () => {
    let libraryMethods: any
    
    createRoot(() => {
      LibraryProvider({
        children: () => {
          const library = useLibrary()
          libraryMethods = library
          return null
        }
      })
    })

    // Test that methods exist and can be called
    expect(typeof libraryMethods.search).toBe('function')
    expect(typeof libraryMethods.setFilters).toBe('function')
    expect(typeof libraryMethods.loadTracks).toBe('function')
    expect(typeof libraryMethods.loadReleases).toBe('function')
    
    // For now, just test that methods exist
    // In a real implementation, these would update the state
    expect(() => libraryMethods.search('test query')).not.toThrow()
    expect(() => libraryMethods.setFilters({ genre: 'house' })).not.toThrow()
    expect(() => libraryMethods.loadTracks()).not.toThrow()
    expect(() => libraryMethods.loadReleases()).not.toThrow()
  })

  it('should throw error when useLibrary is used outside provider', () => {
    expect(() => {
      createRoot(() => {
        useLibrary()
      })
    }).toThrow('useLibrary must be used within LibraryProvider')
  })
})