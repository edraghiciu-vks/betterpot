/**
 * SolidJS hook for integrating frequency analysis with WaveSurfer
 * Provides reactive frequency data and color mapping
 */

import { createSignal, createEffect, onCleanup } from 'solid-js'
import { 
  FrequencyAnalyzer, 
  ColorMapper, 
  createFrequencyAnalyzer, 
  createColorMapper,
  type FrequencyData,
  type ColorMapping,
  type AudioAnalysisConfig,
  type ColorMappingConfig 
} from './audioAnalysis'

export interface UseFrequencyAnalysisOptions {
  /** Audio analysis configuration */
  analysisConfig?: Partial<AudioAnalysisConfig>
  /** Color mapping configuration */
  colorConfig?: Partial<ColorMappingConfig>
  /** Enable automatic start when WaveSurfer is ready */
  autoStart?: boolean
  /** Update interval in milliseconds (default: 16 for ~60fps) */
  updateInterval?: number
}

export interface FrequencyAnalysisState {
  /** Current frequency data */
  frequencyData: FrequencyData | null
  /** Current color mapping */
  colorMapping: ColorMapping | null
  /** Whether analysis is active */
  isAnalyzing: boolean
  /** Analysis error if any */
  error: string | null
}

export const useFrequencyAnalysis = (
  wavesurfer: () => any,
  options: UseFrequencyAnalysisOptions = {}
) => {
  const {
    analysisConfig,
    colorConfig,
    autoStart = true,
    updateInterval = 16
  } = options

  // Create analyzer and color mapper instances
  const analyzer = createFrequencyAnalyzer(analysisConfig)
  const colorMapper = createColorMapper(colorConfig)

  // Reactive state
  const [state, setState] = createSignal<FrequencyAnalysisState>({
    frequencyData: null,
    colorMapping: null,
    isAnalyzing: false,
    error: null
  })

  // Update interval ID
  let intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Initialize frequency analysis when WaveSurfer is ready
   */
  createEffect(() => {
    const ws = wavesurfer()
    if (!ws) return

    const initializeAnalysis = async () => {
      try {
        await analyzer.init(ws)
        setState(prev => ({ 
          ...prev, 
          error: null 
        }))

        if (autoStart) {
          startAnalysis()
        }
      } catch (error) {
        console.error('Failed to initialize frequency analysis:', error)
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error',
          isAnalyzing: false
        }))
      }
    }

    // Initialize when ready or on ready event
    if (ws.backend?.ac) {
      initializeAnalysis()
    } else {
      ws.on('ready', initializeAnalysis)
    }
  })

  /**
   * Start frequency analysis
   */
  const startAnalysis = () => {
    if (intervalId) return // Already running

    analyzer.start()
    
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true 
    }))

    // Update frequency data at specified interval
    intervalId = setInterval(() => {
      const frequencyData = analyzer.getFrequencyData()
      
      if (frequencyData) {
        const colorMapping = colorMapper.mapFrequencyToColor(frequencyData)
        
        setState(prev => ({
          ...prev,
          frequencyData,
          colorMapping
        }))
      }
    }, updateInterval)
  }

  /**
   * Stop frequency analysis
   */
  const stopAnalysis = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }

    analyzer.stop()
    
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: false 
    }))
  }

  /**
   * Toggle analysis state
   */
  const toggleAnalysis = () => {
    if (state().isAnalyzing) {
      stopAnalysis()
    } else {
      startAnalysis()
    }
  }

  /**
   * Update analyzer configuration
   */
  const updateAnalysisConfig = (config: Partial<AudioAnalysisConfig>) => {
    // Note: Some config changes may require reinitialization
    console.log('Analysis config update requested:', config)
  }

  /**
   * Update color mapping configuration
   */
  const updateColorConfig = (config: Partial<ColorMappingConfig>) => {
    colorMapper.updateConfig(config)
  }

  /**
   * Get CSS color string for current frequency data
   */
  const getCurrentColor = (): string => {
    const colorMapping = state().colorMapping
    return colorMapping ? colorMapper.toCssColor(colorMapping) : '#4F4A85'
  }

  /**
   * Get hex color string for current frequency data
   */
  const getCurrentHexColor = (): string => {
    const colorMapping = state().colorMapping
    return colorMapping ? colorMapper.toHexColor(colorMapping) : '#4F4A85'
  }

  // Cleanup on unmount
  onCleanup(() => {
    stopAnalysis()
    analyzer.destroy()
  })

  return {
    // State
    state,
    
    // Control methods
    startAnalysis,
    stopAnalysis,
    toggleAnalysis,
    
    // Configuration methods
    updateAnalysisConfig,
    updateColorConfig,
    
    // Utility methods
    getCurrentColor,
    getCurrentHexColor,
    
    // Direct access to instances (for advanced usage)
    analyzer,
    colorMapper
  }
}