// SolidJS WaveSurfer.js Wrapper Component  
// Simplified component that connects to the centralized player store

import { onMount, onCleanup, createEffect, type JSXElement } from 'solid-js'
import type { WaveSurferOptions } from 'wavesurfer.js'
import { usePlayer } from '../../stores/player'

// Import WaveSurfer plugins
import Timeline from 'wavesurfer.js/dist/plugins/timeline'
import Minimap from 'wavesurfer.js/dist/plugins/minimap'
import Zoom from 'wavesurfer.js/dist/plugins/zoom'

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
  // WaveSurfer options (will be merged with player store defaults)
  options?: Partial<WaveSurferOptions>
  // Plugin configuration
  plugins?: PluginConfig
  // Custom container class
  containerClass?: string
  // Custom container style
  containerStyle?: Record<string, string>
  // Children as render prop or regular JSX
  children?: JSXElement | ((playerState: any) => JSXElement)
  // Custom gradient application callback
  onReady?: () => void
}

export const WaveSurferWrapper = (props: WaveSurferWrapperProps) => {
  const { state, setWaveSurfer, getWaveSurfer } = usePlayer()
  
  let containerRef: HTMLDivElement | undefined

  onMount(() => {
    if (!containerRef) return

    // Initialize WaveSurfer through the player store
    setWaveSurfer(containerRef, props.options)

    // Register plugins if enabled
    const ws = getWaveSurfer()
    if (ws) {
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
    }
  })

  // Call onReady when player becomes ready
  createEffect(() => {
    if (state.ready && props.onReady) {
      props.onReady()
    }
  })

  onCleanup(() => {
    // Player store handles WaveSurfer cleanup
  })

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
        ? props.children(state)
        : props.children
      }
    </div>
  )
}
