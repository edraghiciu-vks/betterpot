// BasicMetadata - Component for displaying basic track metadata like label, BPM, key, etc.
import { Show } from 'solid-js'
import type { Track } from '../../stores/player'
import './StickyWaveSurferPlayer.css'

interface BasicMetadataProps {
  track: Track
  fields?: ('label' | 'bpm' | 'key' | 'genre' | 'subGenre')[]
}

export const BasicMetadata = (props: BasicMetadataProps) => {
  const defaultFields: ('label' | 'bpm' | 'key' | 'genre' | 'subGenre')[] = ['label']
  const fieldsToShow = props.fields || defaultFields

  return (
    <div class="sticky-player__basic-metadata">
      {fieldsToShow.map(field => (
        <Show when={getFieldValue(props.track, field)}>
          <span class={`sticky-player__metadata-${field}`}>
            {getFieldValue(props.track, field)}
          </span>
        </Show>
      ))}
    </div>
  )
}

function getFieldValue(track: Track, field: string): string | null {
  switch (field) {
    case 'label':
      return track.label?.name || null
    case 'bpm':
      return track.bpm ? `${track.bpm} BPM` : null
    case 'key':
      return track.key?.name || null
    case 'genre':
      return track.genre?.name || null
    case 'subGenre':
      return track.sub_genre?.name || null
    default:
      return null
  }
}