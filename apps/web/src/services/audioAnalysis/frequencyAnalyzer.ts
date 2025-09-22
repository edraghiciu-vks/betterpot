/**
 * Frequency analyzer for real-time audio analysis using Web Audio API
 * Extracts bass, mids, and treble data from WaveSurfer instance
 */

import type { 
  FrequencyData, 
  FrequencyBands, 
  AudioAnalysisConfig, 
  AudioAnalyzer 
} from './types'

export class FrequencyAnalyzer implements AudioAnalyzer {
  private analyserNode: AnalyserNode | null = null
  private audioContext: AudioContext | null = null
  private sourceNode: MediaElementAudioSourceNode | null = null
  private frequencyDataArray: Float32Array | null = null
  private isAnalyzing = false
  private animationFrameId: number | null = null
  private mediaElement: HTMLMediaElement | null = null

  // Default frequency bands (in Hz)
  private readonly defaultBands: FrequencyBands = {
    bass: { min: 20, max: 250 },
    mids: { min: 250, max: 4000 },
    treble: { min: 4000, max: 20000 }
  }

  private config: AudioAnalysisConfig = {
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    minDecibels: -100,
    maxDecibels: -30
  }

  private currentFrequencyData: FrequencyData | null = null

  constructor(config?: Partial<AudioAnalysisConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Initialize frequency analyzer with WaveSurfer instance
   */
  async init(wavesurfer: any): Promise<void> {
    try {
      // Get the media element from WaveSurfer
      const mediaElement = wavesurfer.getMediaElement?.()
      if (!mediaElement) {
        throw new Error('Unable to access WaveSurfer media element')
      }

      // If we already have the same media element, don't reinitialize
      if (this.mediaElement === mediaElement && this.audioContext && this.sourceNode) {
        console.log('FrequencyAnalyzer already initialized for this media element')
        return
      }

      // Clean up existing connections if any
      if (this.sourceNode) {
        this.sourceNode.disconnect()
      }
      if (this.analyserNode) {
        this.analyserNode.disconnect()
      }

      // Store reference to media element
      this.mediaElement = mediaElement

      // Create our own AudioContext for frequency analysis
      // We can't use WaveSurfer's context since v7 doesn't expose it
      if (!this.audioContext) {
        this.audioContext = new AudioContext()
      }
      
      // Create analyser node
      this.analyserNode = this.audioContext.createAnalyser()
      this.analyserNode.fftSize = this.config.fftSize
      this.analyserNode.smoothingTimeConstant = this.config.smoothingTimeConstant
      this.analyserNode.minDecibels = this.config.minDecibels
      this.analyserNode.maxDecibels = this.config.maxDecibels

      // Create MediaElementSourceNode to connect HTML5 audio to Web Audio
      // Note: Can only create one source node per media element
      this.sourceNode = this.audioContext.createMediaElementSource(mediaElement)
      
      // Connect: MediaElement -> AnalyserNode -> AudioContext.destination
      this.sourceNode.connect(this.analyserNode)
      this.analyserNode.connect(this.audioContext.destination)

      // Initialize frequency data array
      this.frequencyDataArray = new Float32Array(this.analyserNode.frequencyBinCount)

      console.log('FrequencyAnalyzer initialized:', {
        fftSize: this.analyserNode.fftSize,
        frequencyBinCount: this.analyserNode.frequencyBinCount,
        sampleRate: this.audioContext.sampleRate
      })
    } catch (error) {
      console.error('Failed to initialize FrequencyAnalyzer:', error)
      throw error
    }
  }

  /**
   * Start real-time frequency analysis
   */
  start(): void {
    if (!this.analyserNode || this.isAnalyzing) return

    this.isAnalyzing = true
    this.analyzeFrequencies()
  }

  /**
   * Stop frequency analysis
   */
  stop(): void {
    this.isAnalyzing = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  /**
   * Get current frequency data
   */
  getFrequencyData(): FrequencyData | null {
    return this.currentFrequencyData
  }

  /**
   * Main analysis loop
   */
  private analyzeFrequencies = (): void => {
    if (!this.isAnalyzing || !this.analyserNode || !this.frequencyDataArray) {
      return
    }

    // Get frequency data from analyser
    const tempArray = new Float32Array(this.analyserNode.frequencyBinCount)
    this.analyserNode.getFloatFrequencyData(tempArray)
    this.frequencyDataArray = tempArray

    // Calculate frequency bands
    this.currentFrequencyData = this.calculateFrequencyBands(this.frequencyDataArray)

    // Continue analysis loop
    this.animationFrameId = requestAnimationFrame(this.analyzeFrequencies)
  }

  /**
   * Calculate bass, mids, and treble levels from frequency data
   */
  private calculateFrequencyBands(frequencyData: Float32Array): FrequencyData {
    if (!this.audioContext) {
      return { bass: 0, mids: 0, treble: 0, amplitude: 0 }
    }

    const sampleRate = this.audioContext.sampleRate
    const frequencyBinCount = frequencyData.length
    const frequencyStep = sampleRate / 2 / frequencyBinCount

    const bands = {
      bass: this.config.frequencyBands?.bass || this.defaultBands.bass,
      mids: this.config.frequencyBands?.mids || this.defaultBands.mids,
      treble: this.config.frequencyBands?.treble || this.defaultBands.treble
    }

    // Calculate frequency bin ranges
    const bassRange = this.getFrequencyBinRange(bands.bass, frequencyStep, frequencyBinCount)
    const midsRange = this.getFrequencyBinRange(bands.mids, frequencyStep, frequencyBinCount)
    const trebleRange = this.getFrequencyBinRange(bands.treble, frequencyStep, frequencyBinCount)

    // Calculate average amplitude for each band
    const bassLevel = this.calculateBandAverage(frequencyData, bassRange)
    const midsLevel = this.calculateBandAverage(frequencyData, midsRange)
    const trebleLevel = this.calculateBandAverage(frequencyData, trebleRange)

    // Calculate overall amplitude
    const overallAmplitude = this.calculateOverallAmplitude(frequencyData)

    // Normalize values (convert from dB to 0-1 range)
    const normalizedBass = this.normalizeDecibels(bassLevel)
    const normalizedMids = this.normalizeDecibels(midsLevel)
    const normalizedTreble = this.normalizeDecibels(trebleLevel)
    const normalizedAmplitude = this.normalizeDecibels(overallAmplitude)

    return {
      bass: normalizedBass,
      mids: normalizedMids,
      treble: normalizedTreble,
      amplitude: normalizedAmplitude
    }
  }

  /**
   * Get frequency bin range for a given frequency band
   */
  private getFrequencyBinRange(
    band: { min: number; max: number }, 
    frequencyStep: number, 
    totalBins: number
  ): { start: number; end: number } {
    const start = Math.floor(band.min / frequencyStep)
    const end = Math.min(Math.floor(band.max / frequencyStep), totalBins - 1)
    return { start, end }
  }

  /**
   * Calculate average amplitude for a frequency band
   */
  private calculateBandAverage(
    frequencyData: Float32Array, 
    range: { start: number; end: number }
  ): number {
    let sum = 0
    let count = 0

    for (let i = range.start; i <= range.end; i++) {
      const value = frequencyData[i]
      if (value !== undefined && value !== null) {
        sum += value
        count++
      }
    }

    return count > 0 ? sum / count : this.config.minDecibels
  }

  /**
   * Calculate overall amplitude across all frequencies
   */
  private calculateOverallAmplitude(frequencyData: Float32Array): number {
    let sum = 0
    for (let i = 0; i < frequencyData.length; i++) {
      const value = frequencyData[i]
      if (value !== undefined && value !== null) {
        sum += value
      }
    }
    return sum / frequencyData.length
  }

  /**
   * Normalize decibel values to 0-1 range
   */
  private normalizeDecibels(dbValue: number): number {
    const range = this.config.maxDecibels - this.config.minDecibels
    const normalized = (dbValue - this.config.minDecibels) / range
    return Math.max(0, Math.min(1, normalized))
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop()
    
    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }
    
    if (this.analyserNode) {
      this.analyserNode.disconnect()
      this.analyserNode = null
    }
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.frequencyDataArray = null
    this.currentFrequencyData = null
    this.mediaElement = null
  }
}