// TrackDetails - Component for displaying track name, mix name, and artists
import './StickyWaveSurferPlayer.css'

interface TrackDetailsProps {
  trackName: string
  mixName?: string
  artists: string[]
  size?: 'normal' | 'large'
}

export const TrackDetails = (props: TrackDetailsProps) => {
  const trackNameClass = props.size === 'large' 
    ? 'sticky-player__track-name-large' 
    : 'sticky-player__track-name'
  
  const artistsClass = props.size === 'large' 
    ? 'sticky-player__artists-large' 
    : 'sticky-player__artists'

  return (
    <>
      <div class={trackNameClass}>
        {props.trackName}
        {props.mixName && (
          <span class="sticky-player__mix-name"> ({props.mixName})</span>
        )}
      </div>
      
      <div class={artistsClass}>
        {props.artists.join(', ')}
      </div>
    </>
  )
}