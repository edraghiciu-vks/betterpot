import { createSignal, Show, createEffect } from 'solid-js'
import { WaveSurferWrapper } from '../WaveSurfer/WaveSurferWrapper'
import { usePlayer } from '../../stores/player'
import './StickyWaveSurferPlayer.css'

export const StickyWaveSurferPlayer = () => {
  const { state, stop } = usePlayer()
  const [wsReady, setWsReady] = createSignal(false)
  const [wsLoading, setWsLoading] = createSignal(false)
  const [wsError, setWsError] = createSignal<string | null>(null)
  const [wsControls, setWsControls] = createSignal<any>(null)
  const [zoomLevel, setZoomLevel] = createSignal(3)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Apply SoundCloud-style gradients
  const applySoundCloudGradients = (wavesurfer: any) => {
    if (!wavesurfer) return
    
    try {
      const canvas = wavesurfer.getWrapper().querySelector('canvas')
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Create the unplayed waveform gradient (adapted to your color scheme)
      const waveGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      waveGradient.addColorStop(0, '#9B9B9B') // Top color - lighter gray
      waveGradient.addColorStop(0.7, '#9B9B9B')
      waveGradient.addColorStop(0.71, '#ffffff') // White separator line
      waveGradient.addColorStop(0.72, '#ffffff')
      waveGradient.addColorStop(0.73, '#D1D1D1') // Bottom color - lighter
      waveGradient.addColorStop(1, '#D1D1D1')
      
      // Create the progress gradient (using your brand colors instead of orange)
      const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      progressGradient.addColorStop(0, '#6F6A95') // Brighter brand purple - top
      progressGradient.addColorStop(0.7, '#5d5539') // Brighter brown - top
      progressGradient.addColorStop(0.71, '#ffffff') // White separator
      progressGradient.addColorStop(0.72, '#ffffff')
      progressGradient.addColorStop(0.73, '#AA9FD0') // Brighter lighter purple - bottom
      progressGradient.addColorStop(1, '#AA9FD0')
      
      // Apply gradients to WaveSurfer
      wavesurfer.setOptions({
        waveColor: waveGradient,
        progressColor: progressGradient
      })
    } catch (error) {
      console.warn('Failed to apply SoundCloud gradients:', error)
    }
  }

  // Reset WaveSurfer state when track changes
  createEffect(() => {
    if (state.currentTrack) {
      setWsReady(false)
      setWsLoading(true)
      setWsError(null)
      setZoomLevel(3)
    }
  })

  // Apply initial zoom when WaveSurfer is ready
  createEffect(() => {
    const controls = wsControls()
    if (controls && wsReady() && zoomLevel() === 3) {
      // Apply the initial zoom level of 3
      controls.zoom(zoomLevel() * 20)
    }
  })

  // Auto-play when a new track is loaded and ready
  createEffect(() => {
    const controls = wsControls()
    if (controls && wsReady() && state.currentTrack && !wsLoading() && !wsError()) {
      // Small delay to ensure WaveSurfer is fully ready
      setTimeout(() => {
        controls.play()
      }, 100)
    }
  })

  // Add mouse tracking for SoundCloud-style hover effect
  const setupHoverEffect = (waveformElement: HTMLElement) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = waveformElement.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      waveformElement.style.setProperty('--hover-width', `${offsetX}px`)
    }

    waveformElement.addEventListener('pointermove', handleMouseMove)
    
    return () => {
      waveformElement.removeEventListener('pointermove', handleMouseMove)
    }
  }

  return (
    <div class="sticky-player">
      <div class="sticky-player__content">
        {/* Track Info */}
        <div class="sticky-player__info">
          <Show 
            when={state.currentTrack} 
            fallback={
              <div class="sticky-player__placeholder">
                <div class="sticky-player__placeholder-artwork-large">🎵</div>
                <div class="sticky-player__placeholder-details">
                  <div class="sticky-player__track-name placeholder">
                    Load a track to start playing
                  </div>
                  <div class="sticky-player__track-metadata placeholder">
                    No track selected
                  </div>
                </div>
              </div>
            }
          >
            <div class="sticky-player__track-layout">
              {/* Large Artwork */}
              <div class="sticky-player__artwork-container">
                <Show 
                  when={state.currentTrack?.artwork_url}
                  fallback={
                    <div class="sticky-player__artwork-placeholder">🎵</div>
                  }
                >
                  <img 
                    src={state.currentTrack!.artwork_url} 
                    alt={`Album artwork for ${state.currentTrack!.name}`}
                    class="sticky-player__artwork-large"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback to placeholder on image load error
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const placeholder = target.parentElement?.querySelector('.sticky-player__artwork-placeholder')
                      if (placeholder) {
                        ;(placeholder as HTMLElement).style.display = 'flex'
                      }
                    }}
                    onLoad={(e) => {
                      // Hide placeholder when image loads successfully
                      const target = e.target as HTMLImageElement
                      const placeholder = target.parentElement?.querySelector('.sticky-player__artwork-placeholder')
                      if (placeholder) {
                        ;(placeholder as HTMLElement).style.display = 'none'
                      }
                    }}
                  />
                  {/* Hidden placeholder for error fallback */}
                  <div class="sticky-player__artwork-placeholder" style="display: none;">🎵</div>
                </Show>
              </div>
              
              {/* Track Details Next to Artwork */}
              <div class="sticky-player__track-details-vertical">
                <div class="sticky-player__track-name-large">
                  {state.currentTrack!.name}
                  {state.currentTrack!.mix_name && (
                    <span class="sticky-player__mix-name"> ({state.currentTrack!.mix_name})</span>
                  )}
                </div>
                
                <div class="sticky-player__artists-large">
                  {state.currentTrack!.artists.join(', ')}
                </div>
                
                {/* Only show label here, other metadata moved to controls */}
                <Show when={state.currentTrack!.label}>
                  <div class="sticky-player__basic-metadata">
                    {state.currentTrack!.label!.name}
                  </div>
                </Show>
              </div>
            </div>
          </Show>
        </div>

        {/* WaveSurfer Player */}
        <div class="sticky-player__waveform">
          <Show 
            when={state.currentTrack?.preview_url}
            fallback={
              <div class="sticky-player__placeholder-waveform">
                <div class="sticky-player__placeholder-wave">
                  {/* Sample waveform placeholder */}
                  <div class="placeholder-bars">
                    {Array.from({ length: 40 }, (_, i) => (
                      <div 
                        class="placeholder-bar"
                        style={{ height: `${20 + Math.sin(i * 0.3) * 15}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div class="sticky-player__placeholder-text">
                  Load a track to start playing
                </div>
              </div>
            }
          >
            <div class="soundcloud-waveform-container">
              <WaveSurferWrapper
                url={state.currentTrack!.preview_url}
                plugins={{
                  timeline: false,
                  minimap: false
                }}
                options={{
                  height: 80,
                  // We'll set gradients programmatically in the component
                  waveColor: '#9B9B9B', // Fallback - brighter
                  progressColor: '#6F6A95', // Fallback - brighter 
                  cursorColor: 'transparent',
                  barWidth: 2,
                  barGap: 0.5,
                  barRadius: 0,
                  normalize: true,
                  fillParent: true,
                  interact: true,
                  dragToSeek: true
                }}
                onLoading={setWsLoading}
                onReady={() => {
                  setWsReady(true)
                  setWsLoading(false)
                  setWsError(null)
                  
                  // Apply SoundCloud-style gradients after ready
                  const currentControls = wsControls()
                  if (currentControls) {
                    applySoundCloudGradients(currentControls.getWaveSurfer())
                    
                    // Setup hover effect
                    const waveformElement = currentControls.getWaveSurfer()?.getWrapper()?.querySelector('.soundcloud-waveform')
                    if (waveformElement) {
                      setupHoverEffect(waveformElement as HTMLElement)
                    }
                  }
                }}
                onError={(error) => {
                  setWsError(error.message)
                  setWsLoading(false)
                  setWsReady(false)
                }}
                containerClass="soundcloud-waveform"
                containerStyle={{
                  cursor: 'pointer',
                  position: 'relative',
                  flex: '1',
                  'width': '100%'
                }}
                onTimeUpdate={(time) => {
                  // Force updates for time display
                }}
                onPlayStateChange={(isPlaying) => {
                  // Handle play state changes if needed
                }}
              >
                {(controls, wsState) => {
                  // Store controls for later use
                  setWsControls(controls)
                  
                  
                  return (
                    <div class="soundcloud-hover-overlay"></div>
                  )
                }}
              </WaveSurferWrapper>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}