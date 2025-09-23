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

  return (
    <div class="sticky-player">
      <div class="sticky-player__content">
        {/* Track Info */}
        <div class="sticky-player__info">
          <Show 
            when={state.currentTrack} 
            fallback={
              <div class="sticky-player__placeholder">
                <div class="sticky-player__placeholder-artwork">🎵</div>
                <div class="sticky-player__track-details">
                  <div class="sticky-player__track-name placeholder">
                    Load a track to start playing
                  </div>
                  <div class="sticky-player__artists placeholder">
                    No track selected
                  </div>
                </div>
              </div>
            }
          >
            <Show when={state.currentTrack?.artwork_url}>
              <img 
                src={state.currentTrack!.artwork_url} 
                alt="Track artwork"
                class="sticky-player__artwork"
              />
            </Show>
            <div class="sticky-player__track-details">
              <div class="sticky-player__track-name">
                {state.currentTrack!.name}
                {state.currentTrack!.mix_name && (
                  <span class="sticky-player__mix-name"> ({state.currentTrack!.mix_name})</span>
                )}
              </div>
              <div class="sticky-player__artists">
                {state.currentTrack!.artists.join(', ')}
              </div>
            </div>
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
              <WaveSurferWrapper
                url={state.currentTrack!.preview_url}
                plugins={{
                  timeline: false,
                  minimap: true
                }}
                options={{
                  height: 80,
                  waveColor: '#4F4A85',
                  cursorColor: '#f59e0b',
                  barWidth: 3,
                  barGap: 0.5,
                  barRadius: 1,
                  normalize: true,
                }}
                onLoading={setWsLoading}
                onReady={() => {
                  setWsReady(true)
                  setWsLoading(false)
                  setWsError(null)
                }}
                onError={(error) => {
                  setWsError(error.message)
                  setWsLoading(false)
                  setWsReady(false)
                }}
                containerStyle={{
                  'background-color': 'rgba(255, 255, 255, 0.1)',
                  'border-radius': '6px',
                  padding: '8px',
                  flex: '1',
                  'width': '100%',
                  'min-height': '90px'
                }}
              >
                {(controls, wsState) => {
                  // Store controls for later use
                  setWsControls(controls)
                  
                  return (
                    <div class="sticky-player__controls">
                      <button 
                        onClick={controls.togglePlayPause}
                        disabled={wsState.isLoading || !!wsState.error}
                        class="sticky-player__play-btn"
                        title={controls.isPlaying() ? 'Pause' : 'Play'}
                      >
                        {controls.isPlaying() ? '⏸️' : '▶️'}
                      </button>
                      
                      <button 
                        onClick={() => {
                          controls.stop()
                          stop()
                        }}
                        disabled={wsState.isLoading || !!wsState.error}
                        class="sticky-player__stop-btn"
                        title="Stop"
                      >
                        ⏹️
                      </button>
                      
                      <div class="sticky-player__zoom-controls">
                        <button
                          onClick={() => {
                            if (zoomLevel() > 0.5) {
                              const newZoom = Math.max(0.5, zoomLevel() - 0.5)
                              setZoomLevel(newZoom)
                              controls.zoom(newZoom * 20)
                            }
                          }}
                          disabled={wsState.isLoading || !!wsState.error || zoomLevel() <= 0.5}
                          class="sticky-player__zoom-btn"
                          title="Zoom Out"
                        >
                          🔍-
                        </button>
                        <span class="sticky-player__zoom-level">
                          {Math.round(zoomLevel() * 100)}%
                        </span>
                        <button 
                          onClick={() => {
                            if (zoomLevel() < 3) {
                              const newZoom = Math.min(3, zoomLevel() + 0.5)
                              setZoomLevel(newZoom)
                              controls.zoom(newZoom * 20)
                            }
                          }}
                          disabled={wsState.isLoading || !!wsState.error || zoomLevel() >= 3}
                          class="sticky-player__zoom-btn"
                          title="Zoom In"
                        >
                          🔍+
                        </button>
                      </div>
                      
                      <div class="sticky-player__time">
                        {formatTime(controls.getCurrentTime())} / {formatTime(controls.getDuration())}
                      </div>

                      <div class="sticky-player__status">
                        {wsState.isLoading && <span class="loading">Loading...</span>}
                        {wsState.error && <span class="error">Error: {wsState.error}</span>}
                        {wsState.isReady && !wsState.isLoading && !wsState.error && (
                          <span class="ready">Ready</span>
                        )}
                      </div>
                    </div>
                  )
                }}
              </WaveSurferWrapper>
            </Show>
          </div>

          {/* Close Button */}
          <button 
            class="sticky-player__close-btn"
            onClick={stop}
            title="Close player"
          >
            ✕
          </button>
        </div>
      </div>
    </Show>
  )
}