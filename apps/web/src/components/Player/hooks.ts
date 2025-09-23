// StickyWaveSurferPlayer hooks - Modern SolidJS approach for modular functionality
import { createEffect, onCleanup } from 'solid-js'
import type WaveSurfer from 'wavesurfer.js'
import { usePlayer } from '../../stores/player'

/**
 * Hook for applying SoundCloud-style gradients to WaveSurfer canvas
 * Creates sophisticated waveform gradients with brand colors and white separator lines
 */
export const useSoundCloudGradients = () => {
  const { getWaveSurfer } = usePlayer()

  const applyGradients = (wavesurfer?: WaveSurfer | null) => {
    const ws = wavesurfer || getWaveSurfer()
    if (!ws) return

    try {
      const canvas = ws.getWrapper().querySelector('canvas')
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Create the unplayed waveform gradient (sophisticated gray tones)
      const waveGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      waveGradient.addColorStop(0, '#9B9B9B') // Top color - lighter gray
      waveGradient.addColorStop(0.7, '#9B9B9B')
      waveGradient.addColorStop(0.71, '#ffffff') // White separator line
      waveGradient.addColorStop(0.72, '#ffffff')
      waveGradient.addColorStop(0.73, '#D1D1D1') // Bottom color - lighter
      waveGradient.addColorStop(1, '#D1D1D1')

      // Create the progress gradient (brand colors with white separator)
      const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      progressGradient.addColorStop(0, '#6F6A95') // Brand purple - top
      progressGradient.addColorStop(0.7, '#5d5539') // Brand brown - top
      progressGradient.addColorStop(0.71, '#ffffff') // White separator
      progressGradient.addColorStop(0.72, '#ffffff')
      progressGradient.addColorStop(0.73, '#AA9FD0') // Lighter purple - bottom
      progressGradient.addColorStop(1, '#AA9FD0')

      // Apply gradients to WaveSurfer
      ws.setOptions({
        waveColor: waveGradient,
        progressColor: progressGradient
      })
    } catch (error) {
      console.warn('Failed to apply SoundCloud gradients:', error)
    }
  }

  return { applyGradients }
}

/**
 * Hook for setting up SoundCloud-style hover effects on waveform
 * Tracks mouse movement and updates CSS custom properties for hover preview
 */
export const useWaveformHoverEffect = () => {
  let cleanupFn: (() => void) | null = null

  const setupHoverEffect = (waveformElement: HTMLElement) => {
    // Clean up previous listener if it exists
    if (cleanupFn) {
      cleanupFn()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = waveformElement.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      waveformElement.style.setProperty('--hover-width', `${offsetX}px`)
    }

    const handleMouseLeave = () => {
      waveformElement.style.removeProperty('--hover-width')
    }

    // Add event listeners
    waveformElement.addEventListener('pointermove', handleMouseMove)
    waveformElement.addEventListener('mouseleave', handleMouseLeave)

    // Create cleanup function
    cleanupFn = () => {
      waveformElement.removeEventListener('pointermove', handleMouseMove)
      waveformElement.removeEventListener('mouseleave', handleMouseLeave)
    }

    return cleanupFn
  }

  // Cleanup on component unmount
  onCleanup(() => {
    if (cleanupFn) {
      cleanupFn()
    }
  })

  return { setupHoverEffect }
}

/**
 * Hook for managing initial zoom level when WaveSurfer becomes ready
 * Applies consistent zoom level across player instances
 */
export const useInitialZoom = (zoomLevel: number = 3) => {
  const { state, zoom } = usePlayer()

  createEffect(() => {
    if (state.ready && state.currentTrack) {
      // Apply the zoom level (multiply by 20 for WaveSurfer's minPxPerSec)
      zoom(zoomLevel * 20)
    }
  })

  return { currentZoom: zoomLevel }
}

/**
 * Combined hook for complete WaveSurfer styling setup
 * Combines gradients, hover effects, and zoom for one-stop setup
 */
export const useWaveSurferStyling = (options?: {
  zoomLevel?: number
  enableHover?: boolean
  enableGradients?: boolean
}) => {
  const {
    zoomLevel = 3,
    enableHover = true,
    enableGradients = true
  } = options || {}

  const { applyGradients } = useSoundCloudGradients()
  const { setupHoverEffect } = useWaveformHoverEffect()
  const { currentZoom } = useInitialZoom(zoomLevel)
  const { getWaveSurfer } = usePlayer()

  const setupComplete = () => {
    const ws = getWaveSurfer()
    if (!ws) return

    // Apply gradients if enabled
    if (enableGradients) {
      applyGradients(ws)
    }

    // Setup hover effect if enabled
    if (enableHover) {
      const waveformElement = ws.getWrapper()?.querySelector('.soundcloud-waveform')
      if (waveformElement) {
        setupHoverEffect(waveformElement as HTMLElement)
      }
    }
  }

  return {
    setupComplete,
    applyGradients,
    setupHoverEffect,
    currentZoom
  }
}