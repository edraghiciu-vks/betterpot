// ArtworkDisplay - Component for displaying track artwork with fallback
import { Show } from 'solid-js'
import './StickyWaveSurferPlayer.css'

interface ArtworkDisplayProps {
  artworkUrl?: string
  trackName: string
  size?: 'small' | 'large'
}

export const ArtworkDisplay = (props: ArtworkDisplayProps) => {
  const sizeClass = props.size === 'small' ? 'sticky-player__artwork-small' : 'sticky-player__artwork-large'
  const placeholderClass = props.size === 'small' 
    ? 'sticky-player__artwork-placeholder-small' 
    : 'sticky-player__artwork-placeholder'

  return (
    <div class="sticky-player__artwork-container">
      <Show 
        when={props.artworkUrl}
        fallback={
          <div class={placeholderClass}>🎵</div>
        }
      >
        <img 
          src={props.artworkUrl!} 
          alt={`Album artwork for ${props.trackName}`}
          class={sizeClass}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback to placeholder on image load error
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const placeholder = target.parentElement?.querySelector(`.${placeholderClass}`)
            if (placeholder) {
              ;(placeholder as HTMLElement).style.display = 'flex'
            }
          }}
          onLoad={(e) => {
            // Hide placeholder when image loads successfully
            const target = e.target as HTMLImageElement
            const placeholder = target.parentElement?.querySelector(`.${placeholderClass}`)
            if (placeholder) {
              ;(placeholder as HTMLElement).style.display = 'none'
            }
          }}
        />
        {/* Hidden placeholder for error fallback */}
        <div class={placeholderClass} style="display: none;">🎵</div>
      </Show>
    </div>
  )
}