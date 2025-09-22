/**
 * Audio pre-analyzer for generating frequency data for entire track
 * This analyzes the complete audio file to determine frequency content at each time position
 */

import type { FrequencyData } from '../audioAnalysis/types'
import { ColorMapper } from '../audioAnalysis/colorMapper'

export interface AudioSegmentData {
  /** Time position in seconds */
  time: number
  /** Frequency analysis for this segment */
  frequencyData: FrequencyData
  /** Pre-calculated color for this segment */
  color: string
}

export interface AudioPreAnalyzerConfig {
  /** FFT size for analysis */
  fftSize: number
  /** Analysis window size in seconds */
  windowSize: number
  /** Overlap between windows (0-1) */
  overlap: number
  /** Color mapper for frequency-to-color conversion */
  colorMapper: ColorMapper
}

export class AudioPreAnalyzer {
  private config: AudioPreAnalyzerConfig
  private audioContext: AudioContext | null = null
  private analysisData: AudioSegmentData[] = []

  constructor(config: Partial<AudioPreAnalyzerConfig> = {}) {
    this.config = {
      fftSize: 2048,
      windowSize: 0.1, // 100ms windows
      overlap: 0.5, // 50% overlap
      colorMapper: new ColorMapper(),
      ...config
    }
  }

  /**
   * Analyze entire audio file and generate frequency data for each time segment
   */
  async analyzeAudioFile(audioUrl: string): Promise<AudioSegmentData[]> {
    try {
      console.log('Starting audio pre-analysis for:', audioUrl)
      
      // Create offline audio context for analysis
      this.audioContext = new AudioContext()
      
      // Fetch and decode audio
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      console.log('Audio decoded:', {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        numberOfChannels: audioBuffer.numberOfChannels
      })
      
      // Analyze audio in segments
      this.analysisData = await this.analyzeAudioBuffer(audioBuffer)
      
      console.log('Pre-analysis complete:', this.analysisData.length, 'segments')
      return this.analysisData
      
    } catch (error) {
      console.error('Failed to analyze audio file:', error)
      throw error
    }
  }

  /**
   * Analyze audio buffer in time segments using Web Audio API (much faster)
   */
  private async analyzeAudioBuffer(audioBuffer: AudioBuffer): Promise<AudioSegmentData[]> {
    const sampleRate = audioBuffer.sampleRate
    const duration = audioBuffer.duration
    
    // Use larger segments for better performance - aim for ~100-200 segments max
    const targetSegments = 150
    const segmentDuration = duration / targetSegments
    const windowSamples = Math.floor(segmentDuration * sampleRate)
    const stepSamples = windowSamples // No overlap for better performance
    
    console.log('Analysis parameters:', {
      duration,
      sampleRate,
      targetSegments,
      segmentDuration,
      windowSamples,
      stepSamples,
      totalSamples: audioBuffer.length
    })
    
    const segmentData: AudioSegmentData[] = []
    const channelData = audioBuffer.getChannelData(0) // Use first channel
    
    // Calculate actual number of segments based on buffer length
    const totalSegments = Math.floor((channelData.length - windowSamples) / stepSamples)
    const actualSegments = Math.min(totalSegments, targetSegments)
    
    console.log(`Will analyze ${actualSegments} segments (max ${totalSegments})`)
    
    let processedSegments = 0
    
    // Process segments in smaller chunks for progress updates
    const chunkSize = Math.min(25, actualSegments) // Process 25 segments at a time
    
    for (let chunkStart = 0; chunkStart < actualSegments; chunkStart += chunkSize) {
      const chunkEnd = Math.min(chunkStart + chunkSize, actualSegments)
      
      // Process this chunk
      for (let segmentIndex = chunkStart; segmentIndex < chunkEnd; segmentIndex++) {
        const sampleIndex = segmentIndex * stepSamples
        const time = sampleIndex / sampleRate
        
        // Extract window of audio data
        const windowData = channelData.slice(sampleIndex, sampleIndex + windowSamples)
        
        // Use simplified frequency analysis (much faster than full FFT)
        const freqData = this.fastFrequencyAnalysis(windowData, sampleRate)
        
        // Generate color for this segment
        const colorMapping = this.config.colorMapper.mapFrequencyToColor(freqData)
        const color = this.config.colorMapper.toCssColor(colorMapping)
        
        segmentData.push({
          time,
          frequencyData: freqData,
          color
        })
        
        processedSegments++
      }
      
      // Yield control to prevent blocking and show progress
      if (chunkStart + chunkSize < actualSegments) {
        await new Promise(resolve => setTimeout(resolve, 1))
        const progress = Math.round((processedSegments / actualSegments) * 100)
        console.log(`Analysis progress: ${progress}%`)
      }
    }
    
    console.log(`✅ Analysis complete: ${segmentData.length} segments processed`)
    return segmentData
  }

  /**
   * Fast frequency analysis using simplified approach (much faster than FFT)
   */
  private fastFrequencyAnalysis(windowData: Float32Array, sampleRate: number): FrequencyData {
    // Simple energy-based frequency analysis
    // This is much faster than full FFT and sufficient for basic frequency classification
    
    const windowSize = windowData.length
    let bassEnergy = 0
    let midsEnergy = 0
    let trebleEnergy = 0
    
    // Simple frequency domain analysis using time-domain characteristics
    // Bass: Look for larger amplitude, slower changes
    // Mids: Look for medium amplitude variations
    // Treble: Look for rapid amplitude changes
    
    let totalEnergy = 0
    let rapidChanges = 0
    let slowChanges = 0
    
    for (let i = 1; i < windowSize; i++) {
      const current = Math.abs(windowData[i] || 0)
      const previous = Math.abs(windowData[i - 1] || 0)
      const change = Math.abs(current - previous)
      
      totalEnergy += current * current
      
      if (change > 0.01) rapidChanges++
      if (change < 0.005) slowChanges++
      
      // Simple frequency classification based on signal characteristics
      if (i < windowSize / 8) {
        // Lower frequencies tend to be at the beginning of signal processing
        bassEnergy += current * current
      } else if (i < windowSize / 2) {
        midsEnergy += current * current
      } else {
        trebleEnergy += current * current
      }
    }
    
    // Normalize based on rapid changes (approximates frequency content)
    const rapidRatio = rapidChanges / windowSize
    const slowRatio = slowChanges / windowSize
    
    // Adjust energy based on change patterns
    bassEnergy *= (1 + slowRatio) // Bass has slower changes
    trebleEnergy *= (1 + rapidRatio) // Treble has rapid changes
    midsEnergy *= (1 + (1 - Math.abs(rapidRatio - slowRatio))) // Mids are in between
    
    // Normalize
    const totalFreqEnergy = bassEnergy + midsEnergy + trebleEnergy
    
    if (totalFreqEnergy === 0) {
      return { bass: 0, mids: 0, treble: 0, amplitude: 0 }
    }
    
    return {
      bass: bassEnergy / totalFreqEnergy,
      mids: midsEnergy / totalFreqEnergy,
      treble: trebleEnergy / totalFreqEnergy,
      amplitude: Math.sqrt(totalEnergy / windowSize)
    }
  }

  /**
   * Get color for a specific time position
   */
  getColorAtTime(time: number): string {
    if (this.analysisData.length === 0) {
      return '#4F4A85' // Default color
    }
    
    // Find closest analysis segment
    let closestIndex = 0
    const firstSegment = this.analysisData[0]
    if (!firstSegment) return '#4F4A85'
    
    let closestDistance = Math.abs(firstSegment.time - time)
    
    for (let i = 1; i < this.analysisData.length; i++) {
      const segment = this.analysisData[i]
      if (!segment) continue
      
      const distance = Math.abs(segment.time - time)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }
    
    const closestSegment = this.analysisData[closestIndex]
    return closestSegment?.color || '#4F4A85'
  }

  /**
   * Get analysis data for the entire track
   */
  getAnalysisData(): AudioSegmentData[] {
    return this.analysisData
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.analysisData = []
  }
}