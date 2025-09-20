// Player store - Audio player state management
import { createContext, useContext, createSignal } from 'solid-js'

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
  queue: Track[]
  currentIndex: number
}

interface PlayerContextType {
  state: PlayerState
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  next: () => void
  previous: () => void
}

const PlayerContext = createContext<PlayerContextType>()

export function PlayerProvider(props: { children: any }) {
  const [currentTrack, setCurrentTrack] = createSignal<Track | null>(null)
  const [isPlaying, setIsPlaying] = createSignal(false)
  const [currentTime, setCurrentTime] = createSignal(0)
  const [duration, setDuration] = createSignal(0)
  const [volume, setVolumeSignal] = createSignal(1)
  const [queue, setQueue] = createSignal<Track[]>([])
  const [currentIndex, setCurrentIndex] = createSignal(0)

  const state: PlayerState = {
    get currentTrack() { return currentTrack() },
    get isPlaying() { return isPlaying() },
    get currentTime() { return currentTime() },
    get duration() { return duration() },
    get volume() { return volume() },
    get queue() { return queue() },
    get currentIndex() { return currentIndex() }
  }

  const play = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setDuration(track.duration)
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const resume = () => {
    setIsPlaying(true)
  }

  const seek = (time: number) => {
    setCurrentTime(time)
  }

  const setVolume = (vol: number) => {
    setVolumeSignal(vol)
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
    seek,
    setVolume,
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