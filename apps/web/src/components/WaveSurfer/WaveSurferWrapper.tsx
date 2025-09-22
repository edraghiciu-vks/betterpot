// SolidJS WaveSurfer.js Wrapper Component
// Production-ready wrapper with proper lifecycle management and reactive updates

import { createSignal, onMount, onCleanup, createEffect, type JSXElement } from 'solid-js'
import WaveSurfer from 'wavesurfer.js'
import type { WaveSurferOptions } from 'wavesurfer.js'
import { useFrequencyAnalysis, type UseFrequencyAnalysisOptions } from '../../services/useFrequencyAnalysis'
import { usePreAnalyzedFrequency, type UsePreAnalyzedFrequencyOptions } from '../../services/usePreAnalyzedFrequency'
import { createSimpleFrequencyRenderer, createPreAnalyzedFrequencyRenderer } from '../../services/audioVisualization'

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
  // Frequency analysis controls (available when enabled)
  getFrequencyData?: () => import('../../services/audioAnalysis').FrequencyData | null
  getCurrentColor?: () => string
  getCurrentHexColor?: () => string
  toggleFrequencyAnalysis?: () => void
}

export interface WaveSurferState {
  isReady: boolean
  isLoading: boolean
  error: string | null
}

export interface WaveSurferWrapperProps {
  /** Audio URL to load */
  url?: string
  /** WaveSurfer options */
  options?: Partial<WaveSurferOptions>
  /** Enable/disable interaction */
  interact?: boolean
  /** Enable frequency analysis for color coding */
  enableFrequencyAnalysis?: boolean
  /** Frequency analysis mode: 'realtime' | 'preanalyzed' */
  frequencyAnalysisMode?: 'realtime' | 'preanalyzed'
  /** Frequency analysis options */
  frequencyAnalysisOptions?: UseFrequencyAnalysisOptions
  /** Pre-analyzed frequency options */
  preAnalyzedFrequencyOptions?: UsePreAnalyzedFrequencyOptions
  /** Loading state callback */
  onLoading?: (loading: boolean) => void
  /** Ready state callback */
  onReady?: (duration: number) => void
  /** Time update callback */
  onTimeUpdate?: (currentTime: number) => void
  /** Play state change callback */
  onPlayStateChange?: (isPlaying: boolean) => void
  /** Seek/interaction callback */
  onSeek?: (time: number) => void
  /** Error callback */
  onError?: (error: Error) => void
  /** Custom container class */
  containerClass?: string
  /** Custom container style */
  containerStyle?: Record<string, string>
  /** Children as render prop or regular JSX */
  children?: JSXElement | ((controls: WaveSurferControls, state: WaveSurferState) => JSXElement)
}

export const WaveSurferWrapper = (props: WaveSurferWrapperProps) => {
  const [wavesurfer, setWavesurfer] = createSignal<WaveSurfer | null>(null)
  const [isReady, setIsReady] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  let containerRef: HTMLDivElement | undefined

  // Initialize frequency analysis based on mode
  const frequencyAnalysis = props.enableFrequencyAnalysis && props.frequencyAnalysisMode === 'realtime'
    ? useFrequencyAnalysis(wavesurfer, props.frequencyAnalysisOptions)
    : null

  const preAnalyzedFrequency = props.enableFrequencyAnalysis && props.frequencyAnalysisMode === 'preanalyzed'
    ? usePreAnalyzedFrequency(() => props.url, props.preAnalyzedFrequencyOptions)
    : null

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
  }

  onMount(() => {
    if (!containerRef) return

    try {
      // Prepare options with custom renderer if frequency analysis is enabled
      let renderFunction: ((peaks: Array<Float32Array | number[]>, ctx: CanvasRenderingContext2D) => void) | undefined
      
      if (props.enableFrequencyAnalysis) {
        if (props.frequencyAnalysisMode === 'preanalyzed' && preAnalyzedFrequency) {
          // Use pre-analyzed renderer for individual bar coloring (Serato style)
          renderFunction = createPreAnalyzedFrequencyRenderer({
            preAnalyzer: preAnalyzedFrequency.preAnalyzer,
            defaultWaveColor: props.options?.waveColor as string || '#4F4A85',
            duration: 30 // Will be updated when audio loads
          })
        } else if (props.frequencyAnalysisMode === 'realtime' && frequencyAnalysis) {
          // Use real-time renderer for overall waveform coloring
          renderFunction = createSimpleFrequencyRenderer({
            colorMapper: frequencyAnalysis.colorMapper,
            getFrequencyData: () => frequencyAnalysis.state().frequencyData,
            defaultWaveColor: props.options?.waveColor as string || '#4F4A85',
            defaultProgressColor: props.options?.progressColor as string || '#383351',
            smoothTransitions: true,
            updateInterval: 50
          })
        }
      }

      // Merge default options with user options
      const options: WaveSurferOptions = {
        container: containerRef,
        ...defaultOptions,
        ...props.options,
        ...(renderFunction && { renderFunction })
      }

      const ws = WaveSurfer.create(options)
      setWavesurfer(ws)

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
        
        // Update pre-analyzed renderer with correct duration
        if (props.enableFrequencyAnalysis && props.frequencyAnalysisMode === 'preanalyzed' && preAnalyzedFrequency) {
          const newRenderFunction = createPreAnalyzedFrequencyRenderer({
            preAnalyzer: preAnalyzedFrequency.preAnalyzer,
            defaultWaveColor: props.options?.waveColor as string || '#4F4A85',
            duration: duration
          })
          
          // Update the renderer with correct duration
          ws.setOptions({ renderFunction: newRenderFunction })
          
          // Force re-render to apply new colors
          setTimeout(() => {
            // Trigger redraw by toggling a minor option
            const currentHeight = ws.getWrapper().clientHeight
            ws.setOptions({ height: currentHeight })
          }, 100)
        }
        
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
  const controls = {
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
    
    // Frequency analysis methods (only available when enabled)
    ...(frequencyAnalysis && {
      getFrequencyData: () => frequencyAnalysis.state().frequencyData,
      getCurrentColor: () => frequencyAnalysis.getCurrentColor(),
      getCurrentHexColor: () => frequencyAnalysis.getCurrentHexColor(),
      toggleFrequencyAnalysis: () => frequencyAnalysis.toggleAnalysis()
    })
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
