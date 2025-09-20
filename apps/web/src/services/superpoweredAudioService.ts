// High-performance audio service using Superpowered for music preview playback
import { SuperpoweredWebAudio, SuperpoweredAdvancedAudioPlayer } from '@superpoweredsdk/web'

export interface AudioEventCallbacks {
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onLoadingProgress?: (percent: number) => void
  onError?: (error: string) => void
  onTrackEnd?: () => void
  onLoadComplete?: (duration: number) => void
}

export class SuperpoweredAudioService {
  private superpowered: SuperpoweredWebAudio | null = null
  private player: SuperpoweredAdvancedAudioPlayer | null = null
  private callbacks: AudioEventCallbacks = {}
  private isInitialized = false
  private currentUrl: string | null = null
  private updateInterval: number | null = null

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      this.superpowered = new SuperpoweredWebAudio({
        license: '', // Add your license key if you have one
        enableAudioOutput: true,
        enableAnalysis: false, // Simple preview player doesn't need analysis
        enableTimeStretching: false,
        logLevel: 'error'
      })

      await this.superpowered.start()
      
      this.player = new SuperpoweredAdvancedAudioPlayer(
        this.superpowered.audioContext.sampleRate,
        2, // stereo
        16384, // buffer size
        false // not for real-time processing
      )

      this.isInitialized = true
      console.log('Superpowered audio service initialized')
      return true
    } catch (error) {
      console.error('Failed to initialize Superpowered:', error)
      this.callbacks.onError?.('Failed to initialize audio system')
      return false
    }
  }

  setCallbacks(callbacks: AudioEventCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  async loadTrack(url: string): Promise<boolean> {
    if (!this.isInitialized || !this.player) {
      await this.initialize()
      if (!this.player) return false
    }

    try {
      this.currentUrl = url
      this.callbacks.onLoadingProgress?.(0)

      // Fetch audio data
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const arrayBuffer = await response.arrayBuffer()
      this.callbacks.onLoadingProgress?.(50)

      // Load into Superpowered player
      const success = this.player.loadFromArrayBuffer(arrayBuffer)
      if (success) {
        const duration = this.player.getDuration()
        this.callbacks.onLoadingProgress?.(100)
        this.callbacks.onLoadComplete?.(duration)
        return true
      } else {
        throw new Error('Failed to decode audio')
      }
    } catch (error) {
      console.error('Failed to load track:', error)
      this.callbacks.onError?.('Failed to load audio track')
      return false
    }
  }

  play(): boolean {
    if (!this.player) return false
    
    try {
      this.player.play()
      this.startTimeUpdates()
      return true
    } catch (error) {
      console.error('Failed to play:', error)
      this.callbacks.onError?.('Failed to play audio')
      return false
    }
  }

  pause(): boolean {
    if (!this.player) return false
    
    try {
      this.player.pause()
      this.stopTimeUpdates()
      return true
    } catch (error) {
      console.error('Failed to pause:', error)
      return false
    }
  }

  stop(): boolean {
    if (!this.player) return false
    
    try {
      this.player.stop()
      this.stopTimeUpdates()
      return true
    } catch (error) {
      console.error('Failed to stop:', error)
      return false
    }
  }

  seek(timeInSeconds: number): boolean {
    if (!this.player) return false
    
    try {
      this.player.setPosition(timeInSeconds, false, false)
      return true
    } catch (error) {
      console.error('Failed to seek:', error)
      return false
    }
  }

  setVolume(level: number): boolean {
    if (!this.player) return false
    
    try {
      // Clamp volume between 0 and 1
      const clampedLevel = Math.max(0, Math.min(1, level))
      this.player.setVolume(clampedLevel)
      return true
    } catch (error) {
      console.error('Failed to set volume:', error)
      return false
    }
  }

  getCurrentTime(): number {
    if (!this.player) return 0
    return this.player.getPosition()
  }

  getDuration(): number {
    if (!this.player) return 0
    return this.player.getDuration()
  }

  isPlaying(): boolean {
    if (!this.player) return false
    return this.player.isPlaying()
  }

  isPaused(): boolean {
    if (!this.player) return false
    return this.player.isPaused()
  }

  private startTimeUpdates() {
    if (this.updateInterval) return
    
    this.updateInterval = window.setInterval(() => {
      if (this.player && this.player.isPlaying()) {
        const currentTime = this.getCurrentTime()
        const duration = this.getDuration()
        this.callbacks.onTimeUpdate?.(currentTime, duration)
        
        // Check if track ended
        if (currentTime >= duration && duration > 0) {
          this.stopTimeUpdates()
          this.callbacks.onTrackEnd?.()
        }
      }
    }, 100) // Update every 100ms for smooth progress
  }

  private stopTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  destroy() {
    this.stopTimeUpdates()
    
    if (this.player) {
      this.player.stop()
      this.player = null
    }
    
    if (this.superpowered) {
      this.superpowered.destroy()
      this.superpowered = null
    }
    
    this.isInitialized = false
    this.currentUrl = null
    this.callbacks = {}
  }
}

// Singleton instance for the app
export const audioService = new SuperpoweredAudioService()