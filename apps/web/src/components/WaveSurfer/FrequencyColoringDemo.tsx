// Demo component showing different frequency-based coloring strategies
import { createSignal } from 'solid-js'
import { WaveSurferWrapper, type FrequencyColorOptions } from './WaveSurferWrapper'

export const FrequencyColoringDemo = () => {
  const [selectedStrategy, setSelectedStrategy] = createSignal<'energy' | 'frequency-bands'>('energy')
  const [demoUrl] = createSignal('/path/to/demo/audio.mp3') // Replace with actual demo audio

  const energyColorOptions: FrequencyColorOptions = {
    enabled: true,
    strategy: 'energy',
    lowEnergyColor: '#2a2a4a', // Dark purple for quiet parts
    highEnergyColor: '#ffd700', // Gold for loud parts  
    defaultColor: '#4F4A85',
    smoothing: 0.85
  }

  const frequencyBandOptions: FrequencyColorOptions = {
    enabled: true,
    strategy: 'frequency-bands',
    bassColor: '#ff4444', // Red for bass (low frequencies)
    midsColor: '#44ff44', // Green for mids (middle frequencies)
    trebleColor: '#4444ff', // Blue for treble (high frequencies)
    defaultColor: '#4F4A85',
    smoothing: 0.8
  }

  return (
    <div style={{ padding: '20px', 'background-color': '#f5f5f5' }}>
      <h2>WaveSurfer Frequency-Based Coloring Demo</h2>
      
      <div style={{ 'margin-bottom': '20px' }}>
        <label>
          <input
            type="radio"
            checked={selectedStrategy() === 'energy'}
            onChange={() => setSelectedStrategy('energy')}
          />
          Energy-based coloring (Dark purple → Gold based on loudness)
        </label>
        <br />
        <label>
          <input
            type="radio"
            checked={selectedStrategy() === 'frequency-bands'}
            onChange={() => setSelectedStrategy('frequency-bands')}
          />
          Frequency-band coloring (Red bass → Green mids → Blue treble)
        </label>
      </div>

      <div style={{ 'background-color': 'white', padding: '20px', 'border-radius': '8px' }}>
        <h3>Enhanced Spectrogram with {selectedStrategy() === 'energy' ? 'Energy' : 'Frequency Band'} Coloring</h3>
        
        <WaveSurferWrapper
          url={demoUrl()}
          plugins={{
            timeline: {
              height: 30,
              timeInterval: 0.2,
              primaryLabelInterval: 1,
              secondaryLabelInterval: 0.5
            },
            spectrogram: {
              height: 120,
              fftSamples: 1024,
              labels: true,
              colorMap: 'roseus',
              windowFunc: 'hann',
              scale: 'mel',
              splitChannels: false,
              gainDB: 30,
              rangeDB: 70
            },
            minimap: {
              height: 40,
              waveColor: '#ddd',
              progressColor: '#999'
            }
          }}
          frequencyColors={selectedStrategy() === 'energy' ? energyColorOptions : frequencyBandOptions}
          options={{
            height: 100,
            barWidth: 2,
            barGap: 0.5,
            barRadius: 1,
            normalize: true,
            cursorColor: '#ff6b6b'
          }}
        >
          {(controls, state) => (
            <div style={{ 'margin-top': '10px', display: 'flex', gap: '10px', 'align-items': 'center' }}>
              <button 
                onClick={controls.togglePlayPause}
                disabled={state.isLoading || !!state.error}
                style={{ 
                  padding: '8px 16px', 
                  'background-color': controls.isPlaying() ? '#dc2626' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  'border-radius': '4px',
                  cursor: 'pointer'
                }}
              >
                {controls.isPlaying() ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <button 
                onClick={controls.stop}
                disabled={state.isLoading || !!state.error}
                style={{ 
                  padding: '8px 16px', 
                  'background-color': '#6b7280',
                  color: 'white',
                  border: 'none',
                  'border-radius': '4px',
                  cursor: 'pointer'
                }}
              >
                ⏹️ Stop
              </button>

              <div style={{ 'margin-left': '20px' }}>
                <span>Status: </span>
                {state.isLoading && <span style={{ color: '#f59e0b' }}>Loading...</span>}
                {state.error && <span style={{ color: '#dc2626' }}>Error: {state.error}</span>}
                {state.isReady && !state.isLoading && !state.error && (
                  <span style={{ color: '#16a34a' }}>Ready • Frequency analysis active</span>
                )}
              </div>
            </div>
          )}
        </WaveSurferWrapper>

        <div style={{ 'margin-top': '20px', 'font-size': '14px', color: '#6b7280' }}>
          <h4>Features demonstrated:</h4>
          <ul>
            <li><strong>Native Spectrogram Plugin:</strong> Real-time frequency analysis with Mel scale and Hann windowing</li>
            <li><strong>Frequency-based Waveform Coloring:</strong> Bars change color based on {selectedStrategy() === 'energy' ? 'energy levels' : 'frequency content'}</li>
            <li><strong>Timeline Plugin:</strong> Time markers and navigation</li>
            <li><strong>Minimap Plugin:</strong> Overview and navigation for long tracks</li>
            <li><strong>Enhanced FFT:</strong> 1024 samples for high-resolution frequency analysis</li>
            <li><strong>Optimized Settings:</strong> Configured for music with proper gain and range settings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}