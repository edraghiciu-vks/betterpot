/**
 * SolidJS hook for pre-analyzed frequency-based waveform rendering
 * Provides the Serato DJ Pro style individual bar coloring
 */

import { createSignal, createEffect, onCleanup } from 'solid-js'
import { 
  AudioPreAnalyzer, 
  type AudioSegmentData,
  type AudioPreAnalyzerConfig,
  ColorMapper
} from './audioAnalysis'

export interface UsePreAnalyzedFrequencyOptions {
  /** Pre-analyzer configuration */
  preAnalyzerConfig?: Partial<AudioPreAnalyzerConfig>
  /** Enable automatic analysis when audio URL changes */
  autoAnalyze?: boolean
  /** Callback when analysis completes */
  onAnalysisComplete?: (analysisData: AudioSegmentData[]) => void
}

export interface PreAnalyzedFrequencyState {
  /** Analysis data for the track */
  analysisData: AudioSegmentData[]
  /** Whether analysis is in progress */
  isAnalyzing: boolean
  /** Analysis error if any */
  error: string | null
  /** Analysis progress (0-1) */
  progress: number
}

export const usePreAnalyzedFrequency = (
  audioUrl: () => string | undefined,
  options: UsePreAnalyzedFrequencyOptions = {}
) => {
  const {
    preAnalyzerConfig,
    autoAnalyze = true
  } = options

  // Create pre-analyzer instance
  const preAnalyzer = new AudioPreAnalyzer({
    colorMapper: new ColorMapper(),
    ...preAnalyzerConfig
  })

  // Track current URL to prevent duplicate analysis
  const [currentUrl, setCurrentUrl] = createSignal<string>('')

  // Reactive state
  const [state, setState] = createSignal<PreAnalyzedFrequencyState>({
    analysisData: [],
    isAnalyzing: false,
    error: null,
    progress: 0
  })

  /**
   * Start pre-analysis for the given audio URL
   */
  const startAnalysis = async (url: string) => {
    if (state().isAnalyzing || currentUrl() === url) {
      console.log('⏭️ Skipping analysis - already analyzing or same URL:', url)
      return
    }

    console.log('🎵 Starting pre-analysis for:', url)
    setCurrentUrl(url)
    
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      error: null, 
      progress: 0 
    }))

    try {
      // TODO: Add progress tracking for long analysis
      const analysisData = await preAnalyzer.analyzeAudioFile(url)
      
      setState(prev => ({
        ...prev,
        analysisData,
        isAnalyzing: false,
        progress: 1
      }))
      
      console.log('✅ Pre-analysis completed:', analysisData.length, 'segments')
      console.log('🎨 Sample colors:', analysisData.slice(0, 5).map(d => d.color))
      
      // Notify completion callback
      if (options?.onAnalysisComplete) {
        options.onAnalysisComplete(analysisData)
      }
      
    } catch (error) {
      console.error('Pre-analysis failed:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Analysis failed',
        isAnalyzing: false,
        progress: 0
      }))
    }
  }

  /**
   * Auto-analyze when URL changes (but only once per URL)
   */
  createEffect(() => {
    const url = audioUrl()
    if (url && autoAnalyze && url !== currentUrl() && !state().isAnalyzing) {
      console.log('🔄 URL changed, starting analysis:', url)
      startAnalysis(url)
    }
  })

  /**
   * Clear analysis data
   */
  const clearAnalysis = () => {
    setCurrentUrl('')
    setState({
      analysisData: [],
      isAnalyzing: false,
      error: null,
      progress: 0
    })
  }

  /**
   * Get color for a specific time position
   */
  const getColorAtTime = (time: number): string => {
    return preAnalyzer.getColorAtTime(time)
  }

  /**
   * Check if analysis is ready
   */
  const isReady = (): boolean => {
    return state().analysisData.length > 0 && !state().isAnalyzing
  }

  // Cleanup on unmount
  onCleanup(() => {
    preAnalyzer.destroy()
  })

  return {
    // State
    state,
    
    // Control methods
    startAnalysis,
    clearAnalysis,
    
    // Utility methods
    getColorAtTime,
    isReady,
    
    // Direct access to pre-analyzer
    preAnalyzer
  }
}