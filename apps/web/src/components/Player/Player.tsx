// Audio Player component for track preview functionality
import { usePlayer } from '../../stores/player'
import './Player.css'

export const Player = () => {
  const { state, pause, resume, stop, seek, setVolume, skipBackward, skipForward, previous, next } = usePlayer()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: Event) => {
    const target = e.target as HTMLInputElement
    const progress = parseFloat(target.value) / 100
    seek(progress * state.duration)
  }

  const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    setVolume(parseFloat(target.value) / 100)
  }

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  return (
    <div class="player">
      {/* Track Info */}
      <div class="track-info">
        {state.currentTrack ? (
          <div>
            <div class="track-name">{state.currentTrack.name}</div>
            <div class="track-artists">{state.currentTrack.artists.join(', ')}</div>
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