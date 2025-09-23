// SolidJS WaveSurfer.js Wrapper Component  
// Clean implementation using native WaveSurfer features and plugins

import { createSignal, onMount, onCleanup, createEffect, type JSXElement } from 'solid-js'
import WaveSurfer from 'wavesurfer.js'
import type { WaveSurferOptions } from 'wavesurfer.js'

// Import WaveSurfer plugins
import Timeline from 'wavesurfer.js/dist/plugins/timeline'
import Minimap from 'wavesurfer.js/dist/plugins/minimap'
import Zoom from 'wavesurfer.js/dist/plugins/zoom'

export interface WaveSurferControls {
  play: () => Promise<void> | undefined
  pause: () => void
  stop: () => void
  seekTo: (progress: number) => void
  setTime: (time: number) => void
  togglePlayPause: () => Promise<void> | undefined
  getCurrentTime: () => number
  getDuration: () => number
  isPlaying: () => boolean
  getWaveSurfer: () => WaveSurfer | null
  // Native zoom controls
  zoom: (minPxPerSec: number) => void
  // Scroll controls
  setScroll: (pixels: number) => void
  setScrollTime: (time: number) => void
  getScroll: () => number
}

export interface WaveSurferState {
  isReady: boolean
  isLoading: boolean
  error: string | null
}

export interface PluginConfig {
  // Enable timeline plugin
  timeline?: boolean | {
    height?: number
    timeInterval?: number
    primaryLabelInterval?: number
    secondaryLabelInterval?: number
    style?: Partial<CSSStyleDeclaration>
  }
  // Enable minimap plugin
  minimap?: boolean | {
    height?: number
    waveColor?: string
    progressColor?: string
    insertPosition?: 'afterbegin' | 'beforeend'
  }
  // Enable zoom plugin
  zoom?: boolean | {
    scale?: number
    deltaThreshold?: number
  }
}

export interface WaveSurferWrapperProps {
  // Audio URL to load
  url?: string
  // WaveSurfer options
  options?: Partial<WaveSurferOptions>
  // Enable/disable interaction
  interact?: boolean
  // Plugin configuration
  plugins?: PluginConfig
  // Loading state callback
  onLoading?: (loading: boolean) => void
  // Ready state callback
  onReady?: (duration: number) => void
  // Time update callback
  onTimeUpdate?: (currentTime: number) => void
  // Play state change callback
  onPlayStateChange?: (isPlaying: boolean) => void
  // Seek/interaction callback
  onSeek?: (time: number) => void
  // Error callback
  onError?: (error: Error) => void
  // Custom container class
  containerClass?: string
  // Custom container style
  containerStyle?: Record<string, string>
  // Children as render prop or regular JSX
  children?: JSXElement | ((controls: WaveSurferControls, state: WaveSurferState) => JSXElement)
}

export const WaveSurferWrapper = (props: WaveSurferWrapperProps) => {
  const [wavesurfer, setWavesurfer] = createSignal<WaveSurfer | null>(null)
  const [isReady, setIsReady] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  let containerRef: HTMLDivElement | undefined

  // Default options with sensible defaults for music tracks
  const defaultOptions: Partial<WaveSurferOptions> = {
    waveColor: '#4F4A85',
    progressColor: '#383351', 
    cursorColor: '#ff6b6b',
    barWidth: 3,
    barGap: 0.5,
    barRadius: 2,
    height: 80,
    interact: props.interact ?? true,
    normalize: true,
    fillParent: true,
    autoScroll: true, // Native autoscroll feature
    autoCenter: true, // Native autoCenter feature
    mediaControls: true,
    dragToSeek: true, // Native drag to seek
    
  }

  onMount(() => {
    if (!containerRef) return

    try {
      // Merge default options with user options
      const options: WaveSurferOptions = {
        container: containerRef,
        ...defaultOptions,
        ...props.options,
      }

      const ws = WaveSurfer.create(options)
      setWavesurfer(ws)

      // Register plugins if enabled
      if (props.plugins?.timeline) {
        const timelineOptions = typeof props.plugins.timeline === 'boolean' 
          ? {} 
          : props.plugins.timeline
        
        ws.registerPlugin(Timeline.create({
          height: 30,
          timeInterval: 0.1,
          primaryLabelInterval: 5,
          secondaryLabelInterval: 1,
          ...timelineOptions
        }))
      }

      if (props.plugins?.minimap) {
        const minimapOptions = typeof props.plugins.minimap === 'boolean' 
          ? {} 
          : props.plugins.minimap
        
        ws.registerPlugin(Minimap.create({
          height: 30,
          waveColor: '#ddd',
          progressColor: '#999',
          ...minimapOptions
        }))
      }

      if (props.plugins?.zoom) {
        const zoomOptions = typeof props.plugins.zoom === 'boolean' 
          ? {} 
          : props.plugins.zoom
        
        ws.registerPlugin(Zoom.create({
          scale: 0.5,
          deltaThreshold: 5,
          ...zoomOptions
        }))
      }

      // Set up event listeners
      ws.on('loading', (percent) => {
        const loading = percent < 100
        setIsLoading(loading)
        props.onLoading?.(loading)
      })

      ws.on('ready', (duration) => {
        setIsReady(true)
        setIsLoading(false)
        setError(null)
        props.onReady?.(duration)
      })

      ws.on('play', () => {
        props.onPlayStateChange?.(true)
      })

      ws.on('pause', () => {
        props.onPlayStateChange?.(false)
      })

      ws.on('timeupdate', (time) => {
        props.onTimeUpdate?.(time)
      })

      ws.on('interaction', (newTime) => {
        props.onSeek?.(newTime)
      })

      ws.on('error', (err) => {
        setError(err.message)
        setIsLoading(false)
        setIsReady(false)
        props.onError?.(err)
      })

      // Load initial URL if provided
      if (props.url) {
        ws.load(props.url)
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create WaveSurfer'
      setError(errorMsg)
      props.onError?.(err instanceof Error ? err : new Error(errorMsg))
    }
  })

  // React to URL changes
  createEffect(() => {
    const ws = wavesurfer()
    const url = props.url
    
    if (ws && url) {
      setError(null)
      setIsReady(false)
      ws.load(url)
    }
  })

  // React to interaction changes
  createEffect(() => {
    const ws = wavesurfer()
    if (ws) {
      ws.toggleInteraction(props.interact ?? true)
    }
  })

  onCleanup(() => {
    const ws = wavesurfer()
    if (ws) {
      ws.destroy()
    }
  })

  // Expose control methods
  const controls: WaveSurferControls = {
    play: () => wavesurfer()?.play(),
    pause: () => wavesurfer()?.pause(),
    stop: () => wavesurfer()?.stop(),
    seekTo: (progress: number) => wavesurfer()?.seekTo(progress),
    setTime: (time: number) => wavesurfer()?.setTime(time),
    togglePlayPause: () => wavesurfer()?.playPause(),
    getCurrentTime: () => wavesurfer()?.getCurrentTime() ?? 0,
    getDuration: () => wavesurfer()?.getDuration() ?? 0,
    isPlaying: () => wavesurfer()?.isPlaying() ?? false,
    getWaveSurfer: () => wavesurfer(),
    
    // Native zoom and scroll controls
    zoom: (minPxPerSec: number) => wavesurfer()?.zoom(minPxPerSec),
    setScroll: (pixels: number) => wavesurfer()?.setScroll(pixels),
    setScrollTime: (time: number) => wavesurfer()?.setScrollTime(time),
    getScroll: () => wavesurfer()?.getScroll() ?? 0,
  }

  return (
    <div class="wavesurfer-wrapper">
      <div 
        ref={containerRef}
        class={props.containerClass}
        style={{
          width: '100%',
          'border-radius': '4px',
          'background-color': 'transparent',
          ...props.containerStyle
        }}
      />
      
      {/* Render children */}
      {typeof props.children === 'function' 
        ? props.children(controls, { isReady: isReady(), isLoading: isLoading(), error: error() })
        : props.children
      }
    </div>
  )
}
