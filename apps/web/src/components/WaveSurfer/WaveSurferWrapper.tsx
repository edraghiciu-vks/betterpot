// SolidJS WaveSurfer.js Wrapper Component  
// Clean implementation using native WaveSurfer features and plugins

import { createSignal, onMount, onCleanup, createEffect, type JSXElement } from 'solid-js'
import WaveSurfer from 'wavesurfer.js'
import type { WaveSurferOptions } from 'wavesurfer.js'

// Import WaveSurfer plugins
import Timeline from 'wavesurfer.js/dist/plugins/timeline'
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram'
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
  // Access to plugins
  getSpectrogramPlugin: () => any | null
  // Frequency analysis (when enabled)
  getFrequencyData?: () => Uint8Array | null
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
  // Enable spectrogram plugin
  spectrogram?: boolean | {
    height?: number
    fftSamples?: number
    labels?: boolean
    colorMap?: number[][] | 'gray' | 'igray' | 'roseus'
    windowFunc?: 'bartlett' | 'bartlettHann' | 'blackman' | 'cosine' | 'gauss' | 'hamming' | 'hann' | 'lanczoz' | 'rectangular' | 'triangular'
    scale?: 'linear' | 'logarithmic' | 'mel' | 'bark' | 'erb'
    splitChannels?: boolean
    frequencyMin?: number
    frequencyMax?: number
    gainDB?: number
    rangeDB?: number
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

export interface FrequencyColorOptions {
  // Enable frequency-based waveform coloring
  enabled?: boolean
  // Color mapping strategy
  strategy?: 'energy' | 'frequency-bands' | 'dominant-frequency' | 'spectral-centroid'
  // Bass color (low frequencies)
  bassColor?: string
  // Mids color (middle frequencies) 
  midsColor?: string
  // Treble color (high frequencies)
  trebleColor?: string
  // Low energy color
  lowEnergyColor?: string
  // High energy color
  highEnergyColor?: string
  // Default color fallback
  defaultColor?: string
  // Smoothing factor for color transitions (0-1)
  smoothing?: number
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
  // Frequency-based waveform coloring
  frequencyColors?: FrequencyColorOptions
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
  const [spectrogramPlugin, setSpectrogramPlugin] = createSignal<any>(null)
  const [audioContext, setAudioContext] = createSignal<AudioContext | null>(null)
  const [analyser, setAnalyser] = createSignal<AnalyserNode | null>(null)

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
    dragToSeek: true, // Native drag to seek
  }

  // Create frequency-based render function if enabled
  const createFrequencyColorRenderer = () => {
    if (!props.frequencyColors?.enabled) return undefined
    
    const options = {
      strategy: 'energy',
      bassColor: '#ff0000', // Red for bass
      midsColor: '#00ff00', // Green for mids  
      trebleColor: '#0000ff', // Blue for treble
      lowEnergyColor: '#666666',
      highEnergyColor: '#ffffff',
      defaultColor: '#4F4A85',
      smoothing: 0.8,
      ...props.frequencyColors
    }

    return (peaks: (Float32Array | number[])[], ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas
      const width = canvas.width
      const height = canvas.height
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      const barCount = peaks[0]?.length || 0
      if (barCount === 0) return
      
      const barWidth = width / barCount
      const halfHeight = height / 2
      
      // Get frequency data if available
      const analyserNode = analyser()
      let frequencyData: Uint8Array | null = null
      
      if (analyserNode) {
        try {
          frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
          // Force cast to handle TypeScript strict type checking
          ;(analyserNode as any).getByteFrequencyData(frequencyData)
        } catch (err) {
          // Handle potential audio context issues
          frequencyData = null
        }
      }
      
      // Draw bars with frequency-based coloring
      for (let i = 0; i < barCount; i++) {
        const peakValue = peaks[0]?.[i]
        const peak = peakValue ? Math.abs(peakValue) : 0
        const barHeight = peak * halfHeight
        const x = i * barWidth
        const y = halfHeight - barHeight / 2
        
        let color = options.defaultColor
        
        if (frequencyData && options.strategy === 'energy') {
          // Map bar position to frequency range
          const freqIndex = Math.floor((i / barCount) * frequencyData.length)
          const energyValue = frequencyData[freqIndex]
          
          if (energyValue !== undefined) {
            const energy = energyValue / 255
            
            // Interpolate between low and high energy colors
            if (energy < 0.3) {
              color = options.lowEnergyColor
            } else if (energy > 0.7) {
              color = options.highEnergyColor
            } else {
              // Interpolate based on energy level
              const r = Math.floor(0x4F + (energy * (0xFF - 0x4F)))
              const g = Math.floor(0x4A + (energy * (0xA0 - 0x4A)))
              const b = Math.floor(0x85 + (energy * (0xFF - 0x85)))
              color = `rgb(${r}, ${g}, ${b})`
            }
          }
        } else if (frequencyData && options.strategy === 'frequency-bands') {
          // Map bar position to frequency bands
          const position = i / barCount
          if (position < 0.33) {
            color = options.bassColor // Bass frequencies
          } else if (position < 0.66) {
            color = options.midsColor // Mid frequencies
          } else {
            color = options.trebleColor // Treble frequencies
          }
        }
        
        ctx.fillStyle = color
        ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
      }
    }
  }

  onMount(() => {
    if (!containerRef) return

    try {
      // Create custom render function if frequency coloring is enabled
      const customRenderFunction = createFrequencyColorRenderer()
      
      // Merge default options with user options
      const options: WaveSurferOptions = {
        container: containerRef,
        ...defaultOptions,
        ...props.options,
        ...(customRenderFunction && { renderFunction: customRenderFunction })
      }

      const ws = WaveSurfer.create(options)
      setWavesurfer(ws)

      // Register plugins if enabled
      if (props.plugins?.timeline) {
        const timelineOptions = typeof props.plugins.timeline === 'boolean' 
          ? {} 
          : props.plugins.timeline
        
        ws.registerPlugin(Timeline.create({
          height: 20,
          timeInterval: 0.1,
          primaryLabelInterval: 5,
          secondaryLabelInterval: 1,
          ...timelineOptions
        }))
      }

      if (props.plugins?.spectrogram) {
        const spectrogramOptions = typeof props.plugins.spectrogram === 'boolean' 
          ? {} 
          : props.plugins.spectrogram
        
        const plugin = Spectrogram.create({
          height: 100,
          fftSamples: 512,
          labels: true,
          colorMap: 'roseus', // Use roseus colormap for better visual appeal
          windowFunc: 'hann', // Hann window for better frequency resolution
          scale: 'mel', // Mel scale for perceptually relevant frequency spacing
          ...spectrogramOptions
        })
        
        ws.registerPlugin(plugin)
        setSpectrogramPlugin(plugin)
        
        // Set up audio context and analyser for frequency-based coloring
        if (props.frequencyColors?.enabled) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
            const analyserNode = audioCtx.createAnalyser()
            analyserNode.fftSize = spectrogramOptions.fftSamples || 512
            analyserNode.smoothingTimeConstant = props.frequencyColors.smoothing || 0.8
            
            setAudioContext(audioCtx)
            setAnalyser(analyserNode)
            
            // Connect audio when ready
            ws.on('ready', () => {
              const mediaElement = ws.getMediaElement()
              if (mediaElement && audioCtx && analyserNode) {
                const source = audioCtx.createMediaElementSource(mediaElement)
                source.connect(analyserNode)
                analyserNode.connect(audioCtx.destination)
              }
            })
          } catch (err) {
            console.warn('Could not set up audio context for frequency analysis:', err)
          }
        }
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
    
    // Clean up audio context
    const audioCtx = audioContext()
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close()
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
    
    // Plugin access
    getSpectrogramPlugin: () => spectrogramPlugin(),
    
    // Frequency analysis (when enabled)
    getFrequencyData: props.frequencyColors?.enabled ? () => {
      const analyserNode = analyser()
      if (analyserNode) {
        try {
          const data = new Uint8Array(analyserNode.frequencyBinCount)
          // Force cast to handle TypeScript strict type checking
          ;(analyserNode as any).getByteFrequencyData(data)
          return data
        } catch (err) {
          console.warn('Error getting frequency data:', err)
          return null
        }
      }
      return null
    } : undefined
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
