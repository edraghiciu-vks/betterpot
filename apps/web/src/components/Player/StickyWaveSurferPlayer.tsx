import { Show } from 'solid-js'
import { WaveSurferWrapper } from '../WaveSurfer/WaveSurferWrapper'
import { usePlayer } from '../../stores/player'
import { useWaveSurferStyling } from './hooks'
import { StickyPlayerPlaceholder } from './StickyPlayerPlaceholder'
import { ArtworkDisplay } from './ArtworkDisplay'
import { TrackDetails } from './TrackDetails'
import { BasicMetadata } from './BasicMetadata'
import { WaveformPlaceholder } from './WaveformPlaceholder'
import './StickyWaveSurferPlayer.css'

export const StickyWaveSurferPlayer = () => {
  const { state } = usePlayer()
  
  // Use our modern hooks for WaveSurfer styling
  const { setupComplete } = useWaveSurferStyling({
    zoomLevel: 3,
    enableHover: true,
    enableGradients: true
  })

  return (
    <div class="sticky-player">
      <div class="sticky-player__content">
        {/* Track Info */}
        <div class="sticky-player__info">
          <Show 
            when={state.currentTrack} 
            fallback={<StickyPlayerPlaceholder />}
          >
            <div class="sticky-player__track-layout">
              {/* Large Artwork */}
              <ArtworkDisplay 
                artworkUrl={state.currentTrack!.artwork_url}
                trackName={state.currentTrack!.name}
                size="large"
              />
              
              {/* Track Details Next to Artwork */}
              <div class="sticky-player__track-details-vertical">
                <TrackDetails 
                  trackName={state.currentTrack!.name}
                  mixName={state.currentTrack!.mix_name}
                  artists={state.currentTrack!.artists}
                  size="large"
                />
                
                {/* Basic Metadata */}
                <BasicMetadata 
                  track={state.currentTrack!}
                  fields={['label']}
                />
              </div>
            </div>
          </Show>
        </div>

        {/* WaveSurfer Player */}
        <div class="sticky-player__waveform">
          <Show 
            when={state.currentTrack?.preview_url}
            fallback={<WaveformPlaceholder />}
          >
            <div class="betterpot-waveform-container">
              <WaveSurferWrapper
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
                containerClass="betterpot-waveform"
                containerStyle={{
                  cursor: 'pointer',
                  position: 'relative',
                  flex: '1',
                  'width': '100%'
                }}
                onReady={() => {
                  // Setup complete WaveSurfer styling with modern hooks
                  setupComplete()
                }}
              >
                {(playerState) => (
                  <div class="betterpot-hover-overlay"></div>
                )}
              </WaveSurferWrapper>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}