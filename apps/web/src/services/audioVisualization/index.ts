/**
 * Audio Visualization Module - Public API
 * Provides custom renderers for frequency-based waveform visualization
 */

export {
  createFrequencyBasedRenderer,
  createAdvancedFrequencyRenderer,
  createSimpleFrequencyRenderer,
  createPreAnalyzedFrequencyRenderer,
  type FrequencyBasedRendererConfig,
  type PreAnalyzedRendererConfig
} from './customRenderer'