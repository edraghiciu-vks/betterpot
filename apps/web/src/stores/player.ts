// Player store - Audio player state management
import { createContext, useContext, createSignal, createEffect, onCleanup } from 'solid-js'
import { AudioService, type AudioServiceCallbacks } from '../services/audioService'

export interface Track {
  id: string
  name: string
  artists: string[]
  preview_url?: string
  duration: number
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
}

interface PlayerContextType {
  state: PlayerState
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  skipForward: (seconds?: number) => void
  skipBackward: (seconds?: number) => void
  next: () => void
  previous: () => void
}

const PlayerContext = createContext<PlayerContextType>()

export function PlayerProvider(props: { children: any }) {
  // Create audio service instance
  const audioService = new AudioService()

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

  // Set up audio service callbacks
  createEffect(() => {
    const callbacks: AudioServiceCallbacks = {
      onTimeUpdate: (time: number) => setCurrentTime(time),
      onDurationChange: (dur: number) => setDuration(dur),
      onLoadStart: () => setLoading(true),
      onLoadComplete: () => setLoading(false),
      onLoadError: (err: string) => {
        setError(err)
        setLoading(false)
      },
      onPlayStateChange: (playing: boolean) => setIsPlaying(playing),
      onVolumeChange: (vol: number) => setVolumeSignal(vol),
      onTrackEnd: () => {
        // Auto-play next track if in queue
        next()
      }
    }

    audioService.setCallbacks(callbacks)
  })

  // Cleanup on unmount
  onCleanup(() => {
    audioService.destroy()
  })

  const state: PlayerState = {
    get currentTrack() { return currentTrack() },
    get isPlaying() { return isPlaying() },
    get currentTime() { return currentTime() },
    get duration() { return duration() },
    get volume() { return volume() },
    get loading() { return loading() },
    get error() { return error() },
    get queue() { return queue() },
    get currentIndex() { return currentIndex() }
  }

  const play = async (track: Track) => {
    if (!track.preview_url) {
      setError('No preview URL available for this track')
      return
    }

    setError(null)
    setCurrentTrack(track)
    
    const success = await audioService.loadTrack(track.preview_url)
    if (success) {
      audioService.play()
    }
  }

  const pause = () => {
    audioService.pause()
  }

  const resume = () => {
    audioService.play()
  }

  const stop = () => {
    audioService.stop()
    setCurrentTrack(null)
  }

  const seek = (time: number) => {
    audioService.seek(time)
  }

  const setVolume = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol))
    audioService.setVolume(clampedVol)
  }

  const skipForward = (seconds: number = 10) => {
    audioService.skipForward(seconds)
  }

  const skipBackward = (seconds: number = 10) => {
    audioService.skipBackward(seconds)
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
    previous
  }

  return PlayerContext.Provider({ 
    value: contextValue, 
    children: props.children
  })
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
