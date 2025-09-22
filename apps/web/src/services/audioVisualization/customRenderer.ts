/**
 * Custom WaveSurfer renderer for frequency-based color coding
 * Renders waveform bars with colors based on frequency analysis
 */

import type { FrequencyData, ColorMapping } from '../audioAnalysis/types'
import { ColorMapper } from '../audioAnalysis/colorMapper'
import type { AudioPreAnalyzer } from '../audioAnalysis/audioPreAnalyzer'

export interface FrequencyBasedRendererConfig {
  /** Color mapper instance */
  colorMapper: ColorMapper
  /** Get current frequency data function */
  getFrequencyData: () => FrequencyData | null
  /** Default waveform color when no frequency data */
  defaultWaveColor: string
  /** Default progress color */
  defaultProgressColor: string
  /** Enable smooth color transitions */
  smoothTransitions: boolean
  /** Update interval for color changes (ms) */
  updateInterval: number
}

export interface PreAnalyzedRendererConfig {
  /** Audio pre-analyzer with segment data */
  preAnalyzer: AudioPreAnalyzer
  /** Default waveform color when no analysis data */
  defaultWaveColor: string
  /** Audio duration in seconds */
  duration: number
}

/**
 * Creates a custom render function for WaveSurfer that colors bars based on frequency data
 */
export function createFrequencyBasedRenderer(config: FrequencyBasedRendererConfig) {
  let lastUpdateTime = 0
  let currentColor = config.defaultWaveColor
  
  return function renderFunction(
    peaks: Array<Float32Array | number[]>,
    ctx: CanvasRenderingContext2D
  ): void {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    
    // Get current frequency data
    const now = Date.now()
    if (now - lastUpdateTime > config.updateInterval) {
      const frequencyData = config.getFrequencyData()
      if (frequencyData) {
        const colorMapping = config.colorMapper.mapFrequencyToColor(frequencyData)
        currentColor = config.colorMapper.toCssColor(colorMapping)
        lastUpdateTime = now
      }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Render peaks as bars with frequency-based colors
    const barCount = peaks[0]?.length || 0
    if (barCount === 0) return
    
    const barWidth = width / barCount
    const halfHeight = height / 2
    
    // Set color
    ctx.fillStyle = currentColor || config.defaultWaveColor
    
    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const peakValue = peaks[0]?.[i]
      const peak = peakValue ? Math.abs(peakValue) : 0
      const barHeight = peak * halfHeight
      const x = i * barWidth
      const y = halfHeight - barHeight / 2
      
      // Draw bar
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    }
  }
}

/**
 * Enhanced renderer that applies different colors to different parts of the waveform
 * based on time-based frequency analysis
 */
export function createAdvancedFrequencyRenderer(config: FrequencyBasedRendererConfig) {
  const frequencyHistory: Array<{ time: number; color: string }> = []
  const maxHistory = 1000 // Keep last 1000 samples
  
  return function renderFunction(
    peaks: Array<Float32Array | number[]>,
    ctx: CanvasRenderingContext2D
  ): void {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    
    // Update frequency history
    const frequencyData = config.getFrequencyData()
    if (frequencyData) {
      const colorMapping = config.colorMapper.mapFrequencyToColor(frequencyData)
      const color = config.colorMapper.toCssColor(colorMapping)
      
      frequencyHistory.push({
        time: Date.now(),
        color: color
      })
      
      // Keep history size manageable
      if (frequencyHistory.length > maxHistory) {
        frequencyHistory.shift()
      }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Render peaks as bars
    const barCount = peaks[0]?.length || 0
    if (barCount === 0) return
    
    const barWidth = width / barCount
    const halfHeight = height / 2
    
    // Draw bars with historical colors if available
    for (let i = 0; i < barCount; i++) {
      const peakValue = peaks[0]?.[i]
      const peak = peakValue ? Math.abs(peakValue) : 0
      const barHeight = peak * halfHeight
      const x = i * barWidth
      const y = halfHeight - barHeight / 2
      
      // Use most recent color, or default
      const latestEntry = frequencyHistory[frequencyHistory.length - 1]
      const color = latestEntry?.color || config.defaultWaveColor
      
      ctx.fillStyle = color
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    }
  }
}

/**
 * Simple renderer that just applies current frequency color to entire waveform
 */
export function createSimpleFrequencyRenderer(config: FrequencyBasedRendererConfig) {
  return function renderFunction(
    peaks: Array<Float32Array | number[]>,
    ctx: CanvasRenderingContext2D
  ): void {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Get current color
    let currentColor = config.defaultWaveColor
    const frequencyData = config.getFrequencyData()
    if (frequencyData) {
      const colorMapping = config.colorMapper.mapFrequencyToColor(frequencyData)
      currentColor = config.colorMapper.toCssColor(colorMapping)
      
      // Debug output every few renders
      if (Math.random() < 0.01) { // 1% chance to log
        console.log('Frequency data:', frequencyData)
        console.log('Mapped color:', currentColor)
      }
    }
    
    // Render peaks as bars
    const barCount = peaks[0]?.length || 0
    if (barCount === 0) return
    
    const barWidth = width / barCount
    const halfHeight = height / 2
    
    ctx.fillStyle = currentColor
    
    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const peakValue = peaks[0]?.[i]
      const peak = peakValue ? Math.abs(peakValue) : 0
      const barHeight = peak * halfHeight
      const x = i * barWidth
      const y = halfHeight - barHeight / 2
      
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    }
  }
}

/**
 * Pre-analyzed frequency renderer that colors each bar based on its time position
 * This gives the Serato DJ Pro style effect where each bar has its own color
 */
export function createPreAnalyzedFrequencyRenderer(config: PreAnalyzedRendererConfig) {
  return function renderFunction(
    peaks: Array<Float32Array | number[]>,
    ctx: CanvasRenderingContext2D
  ): void {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Render peaks as bars with individual colors
    const barCount = peaks[0]?.length || 0
    if (barCount === 0) return
    
    const barWidth = width / barCount
    const halfHeight = height / 2
    const duration = config.duration
    
    // Check if analysis is complete
    const analysisData = config.preAnalyzer.getAnalysisData()
    const isAnalysisComplete = analysisData.length > 0
    
    // Draw each bar with its own color based on time position
    for (let i = 0; i < barCount; i++) {
      const peakValue = peaks[0]?.[i]
      const peak = peakValue ? Math.abs(peakValue) : 0
      const barHeight = peak * halfHeight
      const x = i * barWidth
      const y = halfHeight - barHeight / 2
      
      let color = config.defaultWaveColor
      
      if (isAnalysisComplete && duration > 0) {
        // Calculate time position for this bar
        const timePosition = (i / barCount) * duration
        
        // Get color for this time position from pre-analysis
        color = config.preAnalyzer.getColorAtTime(timePosition)
      }
      
      // Set color and draw bar
      ctx.fillStyle = color
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    }
  }
}