/**
 * TypeScript types and interfaces for audio analysis features
 */

export interface FrequencyData {
  /** Bass frequencies (20-250Hz) normalized 0-1 */
  bass: number
  /** Mid frequencies (250Hz-4kHz) normalized 0-1 */
  mids: number
  /** Treble frequencies (4kHz+) normalized 0-1 */
  treble: number
  /** Overall amplitude 0-1 */
  amplitude: number
}

export interface FrequencyBands {
  /** Bass frequency range in Hz */
  bass: { min: number; max: number }
  /** Mid frequency range in Hz */
  mids: { min: number; max: number }
  /** Treble frequency range in Hz */
  treble: { min: number; max: number }
}

export interface AudioAnalysisConfig {
  /** FFT size for frequency analysis (default: 2048) */
  fftSize: number
  /** Smoothing time constant (0-1, default: 0.8) */
  smoothingTimeConstant: number
  /** Minimum decibel value (default: -100) */
  minDecibels: number
  /** Maximum decibel value (default: -30) */
  maxDecibels: number
  /** Custom frequency bands (optional) */
  frequencyBands?: Partial<FrequencyBands>
}

export interface BeatDetectionConfig {
  /** Threshold for beat detection (0-1, default: 0.3) */
  threshold: number
  /** Minimum time between beats in ms (default: 300) */
  minInterval: number
  /** Spectral flux sensitivity (0-1, default: 0.5) */
  sensitivity: number
}

export interface Beat {
  /** Timestamp of the beat in seconds */
  time: number
  /** Confidence level (0-1) */
  confidence: number
  /** Estimated tempo at this beat */
  tempo?: number
}

export interface ColorMapping {
  /** Red channel (0-255) */
  r: number
  /** Green channel (0-255) */
  g: number
  /** Blue channel (0-255) */
  b: number
  /** Alpha channel (0-1) */
  a?: number
}

export interface AudioAnalyzer {
  /** Initialize the analyzer with WaveSurfer instance */
  init(wavesurfer: any): Promise<void>
  /** Get current frequency data */
  getFrequencyData(): FrequencyData | null
  /** Start real-time analysis */
  start(): void
  /** Stop analysis */
  stop(): void
  /** Clean up resources */
  destroy(): void
}

export interface BeatDetector {
  /** Initialize beat detector */
  init(config?: BeatDetectionConfig): void
  /** Process audio data for beat detection */
  processAudioData(frequencyData: Float32Array, timeData: Float32Array): Beat | null
  /** Get detected beats */
  getBeats(): Beat[]
  /** Clear beat history */
  clearBeats(): void
}