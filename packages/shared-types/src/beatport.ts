// Beatport-specific entity types
export interface BeatportTrack {
  id: string;
  name: string;
  mix_name?: string;
  artists: BeatportArtist[];
  remixers?: BeatportArtist[];
  release: BeatportRelease;
  genre: BeatportGenre;
  sub_genre?: BeatportGenre;
  bpm?: number;
  key?: BeatportKey;
  duration: number;
  preview: string;
  sample_start_ms?: number;
  sample_end_ms?: number;
  release_date: string;
  publish_date: string;
  label: BeatportLabel;
  price: BeatportPrice;
  current_status: string;
  track_number?: number;
  isrc?: string;
  slug: string;
  exclusive?: boolean;
  exclusive_period?: string;
  pre_order?: boolean;
  pre_order_date?: string;
}

export interface BeatportArtist {
  id: string;
  name: string;
  slug: string;
  image?: BeatportImage;
  biography?: string;
  facebook_url?: string;
  twitter_url?: string;
  soundcloud_url?: string;
  instagram_url?: string;
  spotify_url?: string;
  beatport_url?: string;
}

export interface BeatportRelease {
  id: string;
  name: string;
  slug: string;
  image?: BeatportImage;
  label: BeatportLabel;
  artists: BeatportArtist[];
  release_date: string;
  publish_date: string;
  track_count: number;
  catalog_number?: string;
  upc?: string;
  grid?: string;
  price: BeatportPrice;
  desc?: string;
  is_exclusive?: boolean;
  exclusive_period?: string;
  pre_order?: boolean;
  pre_order_date?: string;
}

export interface BeatportLabel {
  id: string;
  name: string;
  slug: string;
  image?: BeatportImage;
  desc?: string;
  website_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  soundcloud_url?: string;
  instagram_url?: string;
  spotify_url?: string;
  beatport_url?: string;
}

export interface BeatportGenre {
  id: string;
  name: string;
  slug: string;
}

export interface BeatportKey {
  id: string;
  name: string;
  camelot_number?: string;
  open_key?: string;
  standard?: string;
}

export interface BeatportImage {
  id: string;
  uri: string;
  dynamic_uri?: string;
}

export interface BeatportPrice {
  currency: string;
  value: string;
  symbol: string;
  display: string;
}

export interface BeatportChart {
  id: string;
  name: string;
  slug: string;
  image?: BeatportImage;
  genre?: BeatportGenre;
  sub_genre?: BeatportGenre;
  desc?: string;
  tracks: BeatportTrack[];
}

export interface BeatportUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  image?: BeatportImage;
  country?: string;
  bio?: string;
  dj_name?: string;
  website_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  soundcloud_url?: string;
  instagram_url?: string;
  spotify_url?: string;
  beatport_url?: string;
}