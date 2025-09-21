// Track Player Component with WaveSurfer and AudioService options
// Allows users to test both playback methods with Beatport tracks

import { createSignal, Show } from 'solid-js'
import { WaveSurferWrapper } from './WaveSurferWrapper'
import { usePlayer } from '../../stores/player'
import type { BeatportTrack } from '@betterpot/shared-types'

export interface TrackPlayerProps {
  track: BeatportTrack
  showWaveform?: boolean
  onToggleWaveform?: (enabled: boolean) => void
}

export const TrackPlayer = (props: TrackPlayerProps) => {
  const { state, play } = usePlayer()
  const [useWaveSurfer, setUseWaveSurfer] = createSignal(props.showWaveform ?? false)
  const [wsReady, setWsReady] = createSignal(false)
  const [wsLoading, setWsLoading] = createSignal(false)
  const [wsError, setWsError] = createSignal<string | null>(null)

  // Convert BeatportTrack to player Track format
  const convertToPlayerTrack = (beatportTrack: BeatportTrack) => {
    const previewDurationMs = (beatportTrack.sample_end_ms || 0) - (beatportTrack.sample_start_ms || 0)
    const previewDurationSeconds = previewDurationMs / 1000
    
    return {
      id: beatportTrack.id.toString(),
      name: beatportTrack.name,
      artists: beatportTrack.artists.map(artist => artist.name),
      preview_url: beatportTrack.sample_url,
      duration: 0,
      artwork_url: beatportTrack.release?.image?.uri,
      mix_name: beatportTrack.mix_name,
      preview_duration: previewDurationSeconds > 0 ? previewDurationSeconds : undefined
    }
  }

  const handlePlayWithAudioService = () => {
    const playerTrack = convertToPlayerTrack(props.track)
    play(playerTrack)
  }

  const handleToggleWaveform = () => {
    const newValue = !useWaveSurfer()
    setUseWaveSurfer(newValue)
    props.onToggleWaveform?.(newValue)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isCurrentTrack = () => {
    return state.currentTrack?.id === props.track.id.toString()
  }

  return (
    <div class="track-player" style={{
      padding: '12px',
      border: '1px solid #ddd',
      'border-radius': '8px',
      'margin-bottom': '12px',
      'background-color': '#f9f9f9'
    }}>
      {/* Track Info */}
      <div style={{ 'margin-bottom': '12px' }}>
        <div style={{ 'font-weight': 'bold', 'margin-bottom': '4px' }}>
          {props.track.name}
          {props.track.mix_name && <span style={{ 'font-weight': 'normal', color: '#666' }}> ({props.track.mix_name})</span>}
        </div>
        <div style={{ color: '#666', 'font-size': '14px' }}>
          {props.track.artists.map(artist => artist.name).join(', ')}
        </div>
      </div>

      {/* Player Mode Toggle */}
      <div style={{ 'margin-bottom': '12px' }}>
        <label style={{ display: 'flex', 'align-items': 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={useWaveSurfer()}
            onChange={handleToggleWaveform}
          />
          <span style={{ 'font-size': '14px' }}>
            Use WaveSurfer.js visualization (uncheck for AudioService only)
          </span>
        </label>
      </div>

      {/* WaveSurfer Mode */}
      <Show when={useWaveSurfer()}>
        <div style={{ 'margin-bottom': '12px' }}>
          <div style={{ 
            display: 'flex', 
            'justify-content': 'space-between', 
            'align-items': 'center',
            'margin-bottom': '8px'
          }}>
            <strong style={{ color: '#4F4A85' }}>🌊 WaveSurfer.js Player</strong>
            <div style={{ 'font-size': '12px', color: '#666' }}>
              {wsLoading() && 'Loading...'}
              {wsError() && <span style={{ color: '#e74c3c' }}>Error: {wsError()}</span>}
              {wsReady() && !wsLoading() && !wsError() && 'Ready'}
            </div>
          </div>
          
          {props.track.sample_url ? (
            <WaveSurferWrapper
              url={props.track.sample_url}
              options={{
                height: 60,
                waveColor: '#4F4A85',
                progressColor: '#383351',
                cursorColor: '#ff6b6b',
                barWidth: 2,
                barGap: 1,
                barRadius: 2,
              }}
              onLoading={setWsLoading}
              onReady={() => setWsReady(true)}
              onError={(error) => setWsError(error.message)}
              onSeek={(time) => {
                console.log('WaveSurfer seek to:', time)
              }}
              containerStyle={{
                border: '1px solid #ddd',
                'border-radius': '4px',
                'background-color': 'white',
                padding: '4px'
              }}
            >
              {(controls, state) => (
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  'margin-top': '8px',
                  'align-items': 'center'
                }}>
                  <button 
                    onClick={controls.togglePlayPause}
                    disabled={state.isLoading || !!state.error}
                    style={{
                      padding: '6px 12px',
                      'background-color': controls.isPlaying() ? '#e74c3c' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      'border-radius': '4px',
                      cursor: 'pointer',
                      'font-size': '12px'
                    }}
                  >
                    {controls.isPlaying() ? '⏸️ Pause' : '▶️ Play'}
                  </button>
                  
                  <button 
                    onClick={controls.stop}
                    disabled={state.isLoading || !!state.error}
                    style={{
                      padding: '6px 12px',
                      'background-color': '#95a5a6',
                      color: 'white',
                      border: 'none',
                      'border-radius': '4px',
                      cursor: 'pointer',
                      'font-size': '12px'
                    }}
                  >
                    ⏹️ Stop
                  </button>
                  
                  <span style={{ 'font-size': '12px', color: '#666' }}>
                    {formatTime(controls.getCurrentTime())} / {formatTime(controls.getDuration())}
                  </span>
                </div>
              )}
            </WaveSurferWrapper>
          ) : (
            <div style={{ 
              padding: '20px', 
              'text-align': 'center', 
              color: '#999',
              border: '1px dashed #ddd',
              'border-radius': '4px'
            }}>
              No preview URL available
            </div>
          )}
        </div>
      </Show>

      {/* AudioService Mode */}
      <Show when={!useWaveSurfer()}>
        <div style={{ 'margin-bottom': '12px' }}>
          <div style={{ 
            display: 'flex', 
            'justify-content': 'space-between', 
            'align-items': 'center',
            'margin-bottom': '8px'
          }}>
            <strong style={{ color: '#8B4513' }}>🎵 AudioService Player</strong>
            <div style={{ 'font-size': '12px', color: '#666' }}>
              {state.loading && 'Loading...'}
              {state.error && <span style={{ color: '#e74c3c' }}>Error: {state.error}</span>}
              {!state.loading && !state.error && 'Ready'}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            'align-items': 'center',
            padding: '12px',
            border: '1px solid #ddd',
            'border-radius': '4px',
            'background-color': 'white'
          }}>
            <button 
              onClick={handlePlayWithAudioService}
              disabled={!props.track.sample_url || state.loading}
              style={{
                padding: '8px 16px',
                'background-color': isCurrentTrack() && state.isPlaying ? '#e74c3c' : '#27ae60',
                color: 'white',
                border: 'none',
                'border-radius': '4px',
                cursor: 'pointer'
              }}
            >
              {isCurrentTrack() && state.isPlaying ? '⏸️ Playing' : '▶️ Play'}
            </button>
            
            <Show when={isCurrentTrack()}>
              <span style={{ 'font-size': '14px', color: '#666' }}>
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </span>
            </Show>
          </div>
        </div>
      </Show>

      {/* Comparison Notes */}
      <div style={{ 
        'font-size': '12px', 
        color: '#666', 
        'border-top': '1px solid #eee',
        'padding-top': '8px'
      }}>
        <strong>Compare:</strong> WaveSurfer provides visual waveform + seeking, AudioService offers precise playback control
      </div>
    </div>
  )
}