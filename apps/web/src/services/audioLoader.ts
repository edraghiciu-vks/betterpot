// Audio loading and caching service for preview tracks
import type { Track } from '@betterpot/shared-types'

export interface AudioCache {
  [trackId: string]: {
    url: string
    duration: number
    loadedAt: number
  }
}

export interface LoadingProgress {
  trackId: string
  progress: number
  error?: string
}

export class AudioLoader {
  private cache: AudioCache = {}
  private loadingTracks = new Set<string>()
  private maxCacheSize = 10 // Keep last 10 tracks cached
  private maxCacheAge = 5 * 60 * 1000 // 5 minutes

  async loadTrack(track: Track, onProgress?: (progress: number) => void): Promise<string | null> {
    if (!track.preview_url) {
      console.warn('Track has no preview URL:', track.id)
      return null
    }

    // Check if already cached and still valid
    const cached = this.cache[track.id]
    if (cached && this.isCacheValid(cached)) {
      onProgress?.(100)
      return cached.url
    }

    // Prevent duplicate loading
    if (this.loadingTracks.has(track.id)) {
      return null
    }

    this.loadingTracks.add(track.id)
    onProgress?.(0)

    try {
      // For preview URLs, we typically don't need to cache the actual audio data
      // since they're already optimized streaming URLs
      const url = track.preview_url
      
      // Verify the URL is accessible
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error(`Preview URL not accessible: ${response.status}`)
      }

      // Cache the URL and metadata
      this.cache[track.id] = {
        url,
        duration: track.duration,
        loadedAt: Date.now()
      }

      // Clean up old cache entries
      this.cleanupCache()

      onProgress?.(100)
      return url
    } catch (error) {
      console.error('Failed to load track:', error)
      onProgress?.(-1) // Indicate error
      return null
    } finally {
      this.loadingTracks.delete(track.id)
    }
  }

  getCachedUrl(trackId: string): string | null {
    const cached = this.cache[trackId]
    if (cached && this.isCacheValid(cached)) {
      return cached.url
    }
    return null
  }

  preloadTrack(track: Track): Promise<string | null> {
    return this.loadTrack(track)
  }

  preloadQueue(tracks: Track[]): void {
    // Preload next few tracks in background
    tracks.slice(0, 3).forEach(track => {
      if (!this.cache[track.id] && !this.loadingTracks.has(track.id)) {
        this.preloadTrack(track).catch(console.warn)
      }
    })
  }

  clearCache(): void {
    this.cache = {}
    this.loadingTracks.clear()
  }

  getCacheInfo(): { size: number; tracks: string[] } {
    return {
      size: Object.keys(this.cache).length,
      tracks: Object.keys(this.cache)
    }
  }

  private isCacheValid(cached: AudioCache[string]): boolean {
    return Date.now() - cached.loadedAt < this.maxCacheAge
  }

  private cleanupCache(): void {
    // Remove expired entries
    const now = Date.now()
    Object.keys(this.cache).forEach(trackId => {
      const cached = this.cache[trackId]
      if (cached && now - cached.loadedAt > this.maxCacheAge) {
        delete this.cache[trackId]
      }
    })

    // If still over limit, remove oldest entries
    const remainingEntries = Object.entries(this.cache)
    if (remainingEntries.length > this.maxCacheSize) {
      const sortedByAge = remainingEntries.sort((a, b) => a[1].loadedAt - b[1].loadedAt)
      const toRemove = sortedByAge.slice(0, remainingEntries.length - this.maxCacheSize)
      
      toRemove.forEach(([trackId]) => {
        delete this.cache[trackId]
      })
    }
  }
}

// Singleton instance
export const audioLoader = new AudioLoader()