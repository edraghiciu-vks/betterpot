// Player Provider Tests - Testing user-facing functionality
import { describe, it, expect } from 'vitest'
import { createRoot } from 'solid-js'
import { PlayerProvider, usePlayer, type Track } from '../stores/player'

describe('Player Provider Core Functionality', () => {
  it('should create player context with initial state', () => {
    let playerState: any
    
    createRoot(() => {
      PlayerProvider({
        children: () => {
          const player = usePlayer()
          playerState = player.state
          return null
        }
      })
    })

    expect(playerState.currentTrack).toBe(null)
    expect(playerState.isPlaying).toBe(false)
    expect(playerState.currentTime).toBe(0)
    expect(playerState.duration).toBe(0)
    expect(playerState.volume).toBe(1)
    expect(playerState.queue).toEqual([])
    expect(playerState.currentIndex).toBe(0)
  })

  it('should handle play functionality', () => {
    let playerMethods: any
    let playerState: any
    
    createRoot(() => {
      PlayerProvider({
        children: () => {
          const player = usePlayer()
          playerMethods = player
          playerState = player.state
          return null
        }
      })
    })

    const testTrack: Track = {
      id: '123',
      name: 'Test Track',
      artists: ['Test Artist'],
      duration: 180
    }

    // Test play method exists and can be called
    expect(typeof playerMethods.play).toBe('function')
    expect(typeof playerMethods.pause).toBe('function')
    expect(typeof playerMethods.resume).toBe('function')
    
    // For now, just test that methods exist
    // In a real implementation, these would update the state
    expect(() => playerMethods.play(testTrack)).not.toThrow()
    expect(() => playerMethods.pause()).not.toThrow()
    expect(() => playerMethods.resume()).not.toThrow()
  })

  it('should throw error when usePlayer is used outside provider', () => {
    expect(() => {
      createRoot(() => {
        usePlayer()
      })
    }).toThrow('usePlayer must be used within PlayerProvider')
  })
})