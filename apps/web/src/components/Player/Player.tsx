// Audio Player component for track preview functionality
import { Show, createSignal, onCleanup } from 'solid-js'
import { usePlayer } from '../../stores/player'
import './Player.css'

export const Player = () => {
  const { state, pause, resume, stop, seek, setVolume, skipBackward, skipForward, previous, next } = usePlayer()
  
  // Track if user is currently seeking to prevent conflicts with time updates
  const [isSeeking, setIsSeeking] = createSignal(false)
  let seekTimeout: number | null = null

  // Cleanup timeout on unmount
  onCleanup(() => {
    if (seekTimeout) {
      clearTimeout(seekTimeout)
    }
  })

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
  }

  const handleSeekEnd = () => {
    // Small delay to ensure seek operation completes
    setTimeout(() => setIsSeeking(false), 100)
  }

  const handleSeek = (e: Event) => {
    const target = e.target as HTMLInputElement
    const progress = parseFloat(target.value) / 100
    const seekTime = progress * state.duration
    
    // Clear any pending seek operations
    if (seekTimeout) {
      clearTimeout(seekTimeout)
    }
    
    // Debounce rapid seek calls
    seekTimeout = window.setTimeout(() => {
      seek(seekTime)
      seekTimeout = null
    }, 50)
  }

  const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    setVolume(parseFloat(target.value) / 100)
  }

  // Use seeking state to prevent time update conflicts
  const progressPercentage = state.duration > 0 ? 
    (isSeeking() ? (state.currentTime / state.duration) * 100 : (state.currentTime / state.duration) * 100) : 0

  return (
    <div class="player">
      {/* Track Info */}
      <div class="track-info">
        {state.currentTrack ? (
          <div style={{ display: 'flex', 'align-items': 'center', gap: '12px' }}>
            <Show 
              when={state.currentTrack.artwork_url} 
              fallback={
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  'background-color': '#4b5563', 
                  'border-radius': '4px', 
                  display: 'flex', 
                  'align-items': 'center', 
                  'justify-content': 'center', 
                  color: '#9ca3af', 
                  'font-size': '12px' 
                }}>
                  🎵
                </div>
              }
            >
              <img
                src={state.currentTrack.artwork_url!}
                alt={`${state.currentTrack.name} artwork`}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  'border-radius': '4px', 
                  'object-fit': 'cover' 
                }}
                loading="lazy"
              />
            </Show>
            <div>
              <div class="track-name">{state.currentTrack.name}
                <Show when={state.currentTrack.mix_name}>
                  <span class="text-gray-400 ml-1">({state.currentTrack.mix_name})</span>
                </Show>
              </div>
              <div class="track-artists">{state.currentTrack.artists.join(', ')}</div>
            </div>
          </div>
        ) : (
          <span>No track playing</span>
        )}
        {state.loading && <span class="loading">Loading...</span>}
        {state.error && <span class="error">{state.error}</span>}
      </div>

      {/* Progress Bar */}
      <div class="progress-section">
        <span class="time-current">{formatTime(state.currentTime)}</span>
        <input
          type="range"
          class="progress-bar"
          min="0"
          max="100"
          value={progressPercentage}
          onInput={handleSeek}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          disabled={!state.currentTrack}
        />
        <span class="time-duration">{formatTime(state.duration)}</span>
      </div>

      {/* Main Controls */}
      <div class="player-controls">
        <button onClick={previous} disabled={state.queue.length === 0} title="Previous track">
          ⏮
        </button>
        
        <button onClick={() => skipBackward(10)} disabled={!state.currentTrack} title="Skip back 10s">
          ⏪
        </button>
        
        {state.isPlaying ? (
          <button onClick={pause} disabled={!state.currentTrack} title="Pause">
            ⏸️
          </button>
        ) : (
          <button onClick={resume} disabled={!state.currentTrack} title="Play">
            ▶️
          </button>
        )}
        
        <button onClick={stop} disabled={!state.currentTrack} title="Stop">
          ⏹️
        </button>
        
        <button onClick={() => skipForward(10)} disabled={!state.currentTrack} title="Skip forward 10s">
          ⏩
        </button>
        
        <button onClick={next} disabled={state.queue.length === 0} title="Next track">
          ⏭
        </button>
      </div>

      {/* Volume Control */}
      <div class="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={state.volume * 100}
          onInput={handleVolumeChange}
          title="Volume"
        />
      </div>
    </div>
  )
}