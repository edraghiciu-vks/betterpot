// Audio Player component placeholder
export const Player = () => {
  return (
    <div className="player">
      <div className="player-controls">
        <button>⏮</button>
        <button>▶️</button>
        <button>⏭</button>
      </div>
      <div className="track-info">
        <span>No track playing</span>
      </div>
      <div className="volume-control">
        <input type="range" min="0" max="100" />
      </div>
    </div>
  )
}