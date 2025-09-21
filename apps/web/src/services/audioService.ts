// Robust Web Audio API service for track preview functionality
// Focused on track discovery - play/pause/seek/stop controls with proper state management

export interface AudioServiceCallbacks {
  onTimeUpdate?: (currentTime: number) => void
  onDurationChange?: (duration: number) => void
  onLoadStart?: () => void
  onLoadComplete?: () => void
  onLoadError?: (error: string) => void
  onPlayStateChange?: (isPlaying: boolean) => void
  onVolumeChange?: (volume: number) => void
  onTrackEnd?: () => void
}

export class AudioService {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  private sourceNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private currentUrl: string | null = null
  private isPlaying = false
  private isPaused = false
  private currentPosition = 0 // Current playback position in seconds
  private playStartTime = 0 // When the current play session started (audioContext.currentTime)
  private callbacks: AudioServiceCallbacks = {}
  private updateInterval: number | null = null
  private previewDuration: number | null = null // For UI display purposes

  constructor() {
    this.initializeContext()
  }

  private initializeContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  setCallbacks(callbacks: AudioServiceCallbacks) {
    this.callbacks = callbacks
  }

  private startTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    
    this.updateInterval = window.setInterval(() => {
      if (this.isPlaying && this.audioContext && this.audioBuffer) {
        // Calculate current position: base position + time elapsed since play started
        const elapsedSincePlay = this.audioContext.currentTime - this.playStartTime
        const currentTime = this.currentPosition + elapsedSincePlay
        const maxDuration = this.previewDuration || this.audioBuffer.duration
        
        if (currentTime >= maxDuration) {
          this.stop()
          this.callbacks.onTrackEnd?.()
        } else {
          this.callbacks.onTimeUpdate?.(currentTime)
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

  async loadTrack(url: string, previewDurationSeconds?: number): Promise<boolean> {
    if (!this.audioContext) {
      this.callbacks.onLoadError?.('Audio context not available')
      return false
    }

    // Resume context if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current playback
    this.stop()
    
    this.callbacks.onLoadStart?.()
    this.currentUrl = url
    this.previewDuration = previewDurationSeconds || null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      // Always use the actual audio duration for proper playback
      // But if preview duration is provided, use it for UI display
      const displayDuration = this.previewDuration || this.audioBuffer.duration
      this.callbacks.onDurationChange?.(displayDuration)
      this.callbacks.onLoadComplete?.()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading audio'
      console.error('Error loading audio:', errorMessage)
      this.callbacks.onLoadError?.(errorMessage)
      this.audioBuffer = null
      this.previewDuration = null
      return false
    }
  }

  play(): boolean {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode) {
      return false
    }

    try {
      // Stop any existing source
      if (this.sourceNode) {
        this.sourceNode.disconnect()
        this.sourceNode = null
      }

      // Create new source node
      this.sourceNode = this.audioContext.createBufferSource()
      this.sourceNode.buffer = this.audioBuffer
      this.sourceNode.connect(this.gainNode)

      // Set up ended event
      this.sourceNode.onended = () => {
        if (this.isPlaying) {
          this.stop()
          this.callbacks.onTrackEnd?.()
        }
      }

      // Start playback from current position
      const maxDuration = this.previewDuration || this.audioBuffer.duration
      const clampedPosition = Math.max(0, Math.min(this.currentPosition, maxDuration))
      
      this.sourceNode.start(0, clampedPosition)
      this.playStartTime = this.audioContext.currentTime
      this.isPlaying = true
      this.isPaused = false
      
      this.callbacks.onPlayStateChange?.(true)
      this.startTimeUpdates()
      
      return true
    } catch (error) {
      console.error('Error playing audio:', error)
      return false
    }
  }

  pause(): boolean {
    if (!this.isPlaying || !this.audioContext) {
      return false
    }

    try {
      if (this.sourceNode) {
        // Update current position: base position + time elapsed since play started
        const elapsedSincePlay = this.audioContext.currentTime - this.playStartTime
        this.currentPosition = this.currentPosition + elapsedSincePlay
        
        this.sourceNode.stop()
        this.sourceNode = null
      }

      this.isPlaying = false
      this.isPaused = true
      
      this.callbacks.onPlayStateChange?.(false)
      this.stopTimeUpdates()
      
      return true
    } catch (error) {
      console.error('Error pausing audio:', error)
      return false
    }
  }

  stop(): boolean {
    try {
      if (this.sourceNode) {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
      }

      this.isPlaying = false
      this.isPaused = false
      this.currentPosition = 0
      this.playStartTime = 0
      
      this.callbacks.onPlayStateChange?.(false)
      this.callbacks.onTimeUpdate?.(0)
      this.stopTimeUpdates()
      
      return true
    } catch (error) {
      console.error('Error stopping audio:', error)
      return false
    }
  }

  seek(time: number): boolean {
    if (!this.audioBuffer) {
      return false
    }

    const maxDuration = this.previewDuration || this.audioBuffer.duration
    const clampedTime = Math.max(0, Math.min(time, maxDuration))
    const wasPlaying = this.isPlaying

    // Stop time updates first to prevent race conditions
    this.stopTimeUpdates()

    // Stop current playback
    if (this.sourceNode) {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    // Update state
    this.isPlaying = false
    this.isPaused = true
    this.currentPosition = clampedTime

    // Immediately update the UI
    this.callbacks.onTimeUpdate?.(clampedTime)

    // Resume playback if it was playing
    if (wasPlaying) {
      // Small delay to ensure clean state transition
      setTimeout(() => {
        this.play()
      }, 10)
    }

    return true
  }

  setVolume(volume: number): boolean {
    if (!this.gainNode) {
      return false
    }

    try {
      const clampedVolume = Math.max(0, Math.min(1, volume))
      this.gainNode.gain.setValueAtTime(clampedVolume, this.audioContext?.currentTime || 0)
      this.callbacks.onVolumeChange?.(clampedVolume)
      return true
    } catch (error) {
      console.error('Error setting volume:', error)
      return false
    }
  }

  // Convenience methods for forward/backward functionality
  skipForward(seconds: number = 10): boolean {
    if (!this.audioBuffer) return false
    const currentTime = this.getCurrentTime()
    return this.seek(currentTime + seconds)
  }

  skipBackward(seconds: number = 10): boolean {
    if (!this.audioBuffer) return false
    const currentTime = this.getCurrentTime()
    return this.seek(currentTime - seconds)
  }

  getCurrentTime(): number {
    if (!this.audioContext || !this.audioBuffer) return 0
    
    if (this.isPlaying) {
      // Current position + time elapsed since play started
      const elapsedSincePlay = this.audioContext.currentTime - this.playStartTime
      return this.currentPosition + elapsedSincePlay
    } else {
      return this.currentPosition
    }
  }

  getDuration(): number {
    if (!this.audioBuffer) return 0
    // Return preview duration for UI display, or actual duration if no preview duration set
    return this.previewDuration || this.audioBuffer.duration
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  getIsPaused(): boolean {
    return this.isPaused
  }

  destroy() {
    this.stop()
    this.stopTimeUpdates()
    
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.audioBuffer = null
    this.currentUrl = null
    this.previewDuration = null
    this.callbacks = {}
  }
}