// Audio player related types
export interface Track {
  id: string;
  name: string;
  mix_name?: string;
  artists: Artist[];
  release: Release;
  genre: Genre;
  sub_genre?: Genre;
  bpm?: number;
  key?: string;
  duration: number;
  preview_url?: string;
  release_date: string;
  label: Label;
  price?: string;
  currency?: string;
  isrc?: string;
  artwork?: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  image?: Image;
}

export interface Release {
  id: string;
  name: string;
  slug: string;
  image?: Image;
  label: Label;
  release_date: string;
  track_count: number;
  catalog_number?: string;
}

export interface Label {
  id: string;
  name: string;
  slug: string;
  image?: Image;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Image {
  id: string;
  uri: string;
  dynamic_uri?: string;
  width?: number;
  height?: number;
}

export interface PlayQueue {
  tracks: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'track' | 'queue';
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: PlayQueue;
  loading: boolean;
  error: string | null;
}

// Additional types for preview player functionality
export interface PreviewPlayerState extends PlayerState {
  superpoweredInitialized: boolean;
  loadingProgress: number;
}

export interface PlayerControls {
  play: (track?: Track) => Promise<boolean>;
  pause: () => boolean;
  stop: () => boolean;
  seek: (time: number) => boolean;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => boolean;
  toggleMute: () => boolean;
}

export interface AudioSettings {
  volume: number;
  crossfade: number;
  equalizer: EqualizerSettings;
  quality: 'low' | 'medium' | 'high';
}

export interface EqualizerSettings {
  enabled: boolean;
  preamp: number;
  bands: number[];
}