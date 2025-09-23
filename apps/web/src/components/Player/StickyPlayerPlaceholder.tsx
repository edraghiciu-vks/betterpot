// StickyPlayerPlaceholder - Placeholder component when no track is selected
import './StickyWaveSurferPlayer.css'

export const StickyPlayerPlaceholder = () => {
  return (
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
  )
}