/**
 * Color mapping utilities for frequency-based waveform visualization
 * Maps frequency data to RGB color values
 */

import type { FrequencyData, ColorMapping } from './types'

export interface ColorMappingConfig {
  /** Intensity multiplier for bass (red) channel (default: 1.0) */
  bassIntensity: number
  /** Intensity multiplier for mids (green) channel (default: 1.0) */
  midsIntensity: number
  /** Intensity multiplier for treble (blue) channel (default: 1.0) */
  trebleIntensity: number
  /** Minimum brightness (0-1, default: 0.1) */
  minBrightness: number
  /** Maximum brightness (0-1, default: 1.0) */
  maxBrightness: number
  /** Enable amplitude-based alpha blending (default: true) */
  useAmplitudeAlpha: boolean
}

export class ColorMapper {
  private config: ColorMappingConfig = {
    bassIntensity: 1.0,
    midsIntensity: 1.0,
    trebleIntensity: 1.0,
    minBrightness: 0.1,
    maxBrightness: 1.0,
    useAmplitudeAlpha: true
  }

  constructor(config?: Partial<ColorMappingConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Map frequency data to RGB color
   */
  mapFrequencyToColor(frequencyData: FrequencyData): ColorMapping {
    // Apply intensity multipliers
    const bassLevel = Math.min(1, frequencyData.bass * this.config.bassIntensity)
    const midsLevel = Math.min(1, frequencyData.mids * this.config.midsIntensity)
    const trebleLevel = Math.min(1, frequencyData.treble * this.config.trebleIntensity)

    // Calculate brightness from overall amplitude
    const brightness = this.calculateBrightness(frequencyData.amplitude)

    // Map to RGB (0-255 range)
    const r = Math.round(bassLevel * brightness * 255)
    const g = Math.round(midsLevel * brightness * 255)
    const b = Math.round(trebleLevel * brightness * 255)

    // Calculate alpha based on amplitude if enabled
    const alpha = this.config.useAmplitudeAlpha 
      ? Math.max(0.3, frequencyData.amplitude) 
      : 1.0

    return { r, g, b, a: alpha }
  }

  /**
   * Generate CSS color string from color mapping
   */
  toCssColor(color: ColorMapping): string {
    if (color.a !== undefined && color.a < 1) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  /**
   * Generate hex color string from color mapping
   */
  toHexColor(color: ColorMapping): string {
    const r = color.r.toString(16).padStart(2, '0')
    const g = color.g.toString(16).padStart(2, '0')
    const b = color.b.toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }

  /**
   * Create gradient from frequency data array
   */
  createGradient(frequencyDataArray: FrequencyData[]): string[] {
    return frequencyDataArray.map(data => 
      this.toCssColor(this.mapFrequencyToColor(data))
    )
  }

  /**
   * Calculate brightness based on amplitude and config
   */
  private calculateBrightness(amplitude: number): number {
    const range = this.config.maxBrightness - this.config.minBrightness
    return this.config.minBrightness + (amplitude * range)
  }

  /**
   * Update color mapping configuration
   */
  updateConfig(config: Partial<ColorMappingConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): ColorMappingConfig {
    return { ...this.config }
  }

  /**
   * Reset to default configuration
   */
  resetConfig(): void {
    this.config = {
      bassIntensity: 1.0,
      midsIntensity: 1.0,
      trebleIntensity: 1.0,
      minBrightness: 0.1,
      maxBrightness: 1.0,
      useAmplitudeAlpha: true
    }
  }

  /**
   * Generate color palette from frequency data for visualization preview
   */
  generateColorPalette(frequencyDataArray: FrequencyData[], steps = 10): ColorMapping[] {
    const palette: ColorMapping[] = []
    const stepSize = Math.max(1, Math.floor(frequencyDataArray.length / steps))
    
    for (let i = 0; i < frequencyDataArray.length; i += stepSize) {
      const data = frequencyDataArray[i]
      if (data) {
        palette.push(this.mapFrequencyToColor(data))
      }
    }
    
    return palette
  }
}