/**
 * Audio Analysis Module - Public API
 * Provides frequency analysis and color mapping for WaveSurfer.js
 */

// Export types
export type {
  FrequencyData,
  FrequencyBands,
  AudioAnalysisConfig,
  BeatDetectionConfig,
  Beat,
  ColorMapping,
  AudioAnalyzer,
  BeatDetector
} from './types'

// Export main classes
export { FrequencyAnalyzer } from './frequencyAnalyzer'
export { ColorMapper } from './colorMapper'
export { AudioPreAnalyzer } from './audioPreAnalyzer'
export type { ColorMappingConfig } from './colorMapper'
export type { AudioSegmentData, AudioPreAnalyzerConfig } from './audioPreAnalyzer'

// Import for utility functions
import { FrequencyAnalyzer } from './frequencyAnalyzer'
import { ColorMapper } from './colorMapper'
import type { AudioAnalysisConfig, FrequencyBands } from './types'
import type { ColorMappingConfig } from './colorMapper'

// Export utility functions
export const createFrequencyAnalyzer = (config?: Partial<AudioAnalysisConfig>) => {
  return new FrequencyAnalyzer(config)
}

export const createColorMapper = (config?: Partial<ColorMappingConfig>) => {
  return new ColorMapper(config)
}

// Default configurations
export const DEFAULT_FREQUENCY_BANDS: FrequencyBands = {
  bass: { min: 20, max: 250 },
  mids: { min: 250, max: 4000 },
  treble: { min: 4000, max: 20000 }
}

export const DEFAULT_ANALYSIS_CONFIG: AudioAnalysisConfig = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -100,
  maxDecibels: -30
}

export const DEFAULT_COLOR_CONFIG: ColorMappingConfig = {
  bassIntensity: 1.0,
  midsIntensity: 1.0,
  trebleIntensity: 1.0,
  minBrightness: 0.1,
  maxBrightness: 1.0,
  useAmplitudeAlpha: true
}