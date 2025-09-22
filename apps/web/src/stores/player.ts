// Player store - WaveSurfer-based audio player state management
import { createContext, useContext, createSignal, createEffect, onCleanup } from 'solid-js'

export interface Track {
  id: string
  name: string
  artists: string[]
  preview_url?: string
  duration: number
  artwork_url?: string
  mix_name?: string
  preview_duration?: number // Preview duration in seconds
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
    setLoading(true)
    
    // WaveSurfer will handle the actual audio loading and playback
    // The StickyWaveSurferPlayer component will manage the WaveSurfer instance
  }

  const pause = () => {
    setIsPlaying(false)
    // WaveSurfer pause will be handled by the player component
  }

  const resume = () => {
    setIsPlaying(true)
    // WaveSurfer play will be handled by the player component
  }

  const stop = () => {
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setError(null)
    // WaveSurfer stop will be handled by the player component
  }

  const seek = (time: number) => {
    setCurrentTime(time)
    // WaveSurfer seek will be handled by the player component
  }

  const setVolume = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol))
    setVolumeSignal(clampedVol)
    // WaveSurfer volume will be handled by the player component
  }

  const skipForward = (seconds: number = 10) => {
    const newTime = Math.min(currentTime() + seconds, duration())
    setCurrentTime(newTime)
    // WaveSurfer seek will be handled by the player component
  }

  const skipBackward = (seconds: number = 10) => {
    const newTime = Math.max(currentTime() - seconds, 0)
    setCurrentTime(newTime)
    // WaveSurfer seek will be handled by the player component
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
