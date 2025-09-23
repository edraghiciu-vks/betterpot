// Player store - WaveSurfer-based audio player state management
import { createContext, useContext, createSignal, onCleanup } from 'solid-js'
import WaveSurfer from 'wavesurfer.js'
import type { WaveSurferOptions } from 'wavesurfer.js'

export interface Track {
  id: string
  name: string
  artists: string[]
  preview_url?: string
  duration: number
  artwork_url?: string
  mix_name?: string
  preview_duration?: number // Preview duration in seconds
  // Additional metadata
  bpm?: number
  key?: {
    name: string
    camelot_number?: number
    camelot_letter?: string
  }
  genre?: {
    name: string
  }
  sub_genre?: {
    name: string
  }
  label?: {
    name: string
  }
}

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  loading: boolean
  error: string | null
  queue: Track[]
  currentIndex: number
  // WaveSurfer-specific state
  ready: boolean
}

interface PlayerContextType {
  state: PlayerState
  // Core player controls
  play: (track?: Track) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  skipForward: (seconds?: number) => void
  skipBackward: (seconds?: number) => void
  next: () => void
  previous: () => void
  // WaveSurfer management
  setWaveSurfer: (container: HTMLElement, options?: Partial<WaveSurferOptions>) => void
  getWaveSurfer: () => WaveSurfer | null
  // Advanced controls
  zoom: (minPxPerSec: number) => void
  setScroll: (pixels: number) => void
  setScrollTime: (time: number) => void
}

const PlayerContext = createContext<PlayerContextType>()

export function PlayerProvider(props: { children: any }) {
  // State signals
  const [currentTrack, setCurrentTrack] = createSignal<Track | null>(null)
  const [isPlaying, setIsPlaying] = createSignal(false)
  const [currentTime, setCurrentTime] = createSignal(0)
  const [duration, setDuration] = createSignal(0)
  const [volume, setVolumeSignal] = createSignal(1)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [queue, setQueue] = createSignal<Track[]>([])
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [ready, setReady] = createSignal(false)

  // WaveSurfer instance
  const [wavesurfer, setWavesurferSignal] = createSignal<WaveSurfer | null>(null)

  const state: PlayerState = {
    get currentTrack() { return currentTrack() },
    get isPlaying() { return isPlaying() },
    get currentTime() { return currentTime() },
    get duration() { return duration() },
    get volume() { return volume() },
    get loading() { return loading() },
    get error() { return error() },
    get queue() { return queue() },
    get currentIndex() { return currentIndex() },
    get ready() { return ready() }
  }

  const setWaveSurfer = (container: HTMLElement, options?: Partial<WaveSurferOptions>) => {
    // Clean up existing instance
    const existing = wavesurfer()
    if (existing) {
      existing.destroy()
    }

    try {
      // Default options optimized for music tracks
      const defaultOptions: WaveSurferOptions = {
        container,
        waveColor: '#9B9B9B',
        progressColor: '#6F6A95',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 0.5,
        barRadius: 0,
        height: 80,
        normalize: true,
        fillParent: true,
        interact: true,
        dragToSeek: true,
        autoScroll: true,
        autoCenter: true,
        mediaControls: true,
        ...options
      }

      const ws = WaveSurfer.create(defaultOptions)
      setWavesurferSignal(ws)

      // Set up event listeners
      ws.on('loading', (percent) => {
        setLoading(percent < 100)
      })

      ws.on('ready', (dur) => {
        setReady(true)
        setLoading(false)
        setDuration(dur)
        setError(null)
        
        // Apply volume
        ws.setVolume(volume())
        
        // Auto-play if there's a current track
        if (currentTrack()) {
          ws.play()
        }
      })

      ws.on('play', () => {
        setIsPlaying(true)
      })

      ws.on('pause', () => {
        setIsPlaying(false)
      })

      ws.on('timeupdate', (time) => {
        setCurrentTime(time)
      })

      ws.on('interaction', (time) => {
        setCurrentTime(time)
      })

      ws.on('error', (err) => {
        setError(err.message)
        setLoading(false)
        setReady(false)
      })

      // Load current track if available
      const track = currentTrack()
      if (track?.preview_url) {
        ws.load(track.preview_url)
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create WaveSurfer'
      setError(errorMsg)
    }
  }

  const getWaveSurfer = () => wavesurfer()

  const play = async (track?: Track) => {
    const ws = wavesurfer()
    
    if (track) {
      // Playing a new track
      if (!track.preview_url) {
        setError('No preview URL available for this track')
        return
      }

      setError(null)
      setCurrentTrack(track)
      setReady(false)
      setLoading(true)
      
      if (ws) {
        ws.load(track.preview_url)
      }
    } else {
      // Resume current track
      if (ws && ready()) {
        await ws.play()
      }
    }
  }

  const pause = () => {
    const ws = wavesurfer()
    if (ws) {
      ws.pause()
    }
  }

  const resume = () => {
    const ws = wavesurfer()
    if (ws && ready()) {
      ws.play()
    }
  }

  const stop = () => {
    const ws = wavesurfer()
    if (ws) {
      ws.stop()
    }
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setReady(false)
    setError(null)
  }

  const seek = (time: number) => {
    const ws = wavesurfer()
    if (ws && ready()) {
      ws.setTime(time)
    }
  }

  const setVolume = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol))
    setVolumeSignal(clampedVol)
    
    const ws = wavesurfer()
    if (ws) {
      ws.setVolume(clampedVol)
    }
  }

  const skipForward = (seconds: number = 10) => {
    const newTime = Math.min(currentTime() + seconds, duration())
    seek(newTime)
  }

  const skipBackward = (seconds: number = 10) => {
    const newTime = Math.max(currentTime() - seconds, 0)
    seek(newTime)
  }

  const next = () => {
    const nextIndex = currentIndex() + 1
    if (nextIndex < queue().length) {
      setCurrentIndex(nextIndex)
      const nextTrack = queue()[nextIndex]
      if (nextTrack) {
        play(nextTrack)
      }
    }
  }

  const previous = () => {
    const prevIndex = currentIndex() - 1
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex)
      const prevTrack = queue()[prevIndex]
      if (prevTrack) {
        play(prevTrack)
      }
    }
  }

  const zoom = (minPxPerSec: number) => {
    const ws = wavesurfer()
    if (ws) {
      ws.zoom(minPxPerSec)
    }
  }

  const setScroll = (pixels: number) => {
    const ws = wavesurfer()
    if (ws) {
      ws.setScroll(pixels)
    }
  }

  const setScrollTime = (time: number) => {
    const ws = wavesurfer()
    if (ws) {
      ws.setScrollTime(time)
    }
  }

  // Cleanup on unmount
  onCleanup(() => {
    const ws = wavesurfer()
    if (ws) {
      ws.destroy()
    }
  })

  const contextValue: PlayerContextType = {
    state,
    play,
    pause,
    resume,
    stop,
    seek,
    setVolume,
    skipForward,
    skipBackward,
    next,
    previous,
    setWaveSurfer,
    getWaveSurfer,
    zoom,
    setScroll,
    setScrollTime
  }

  return PlayerContext.Provider({
    value: contextValue,
    get children() { return props.children }
  })
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
