// Beatport-specific entity types
export interface BeatportTrack {
  id: number;
  name: string;
  mix_name?: string;
  artists: BeatportArtist[];
  remixers?: BeatportArtist[];
  release: BeatportRelease;
  genre: BeatportGenre;
  sub_genre?: BeatportGenre;
  bpm?: number;
  key?: BeatportKey;
  length: string; // Format like "3:50"
  length_ms: number; // Duration in milliseconds
  sample_url: string; // URL to the preview sample
  sample_start_ms?: number;
  sample_end_ms?: number;
  new_release_date: string;
  publish_date: string;
  price: BeatportPrice;
  current_status: BeatportCurrentStatus;
  catalog_number?: string;
  isrc?: string;
  slug: string;
  exclusive?: boolean;
  pre_order?: boolean;
  pre_order_date?: string;
  free_download_start_date?: string;
  free_download_end_date?: string;
  free_downloads?: any[];
  encoded_date?: string;
  available_worldwide?: boolean;
  publish_status?: string;
  is_available_for_streaming?: boolean;
  is_explicit?: boolean;
  label_track_identifier?: string;
  sale_type?: BeatportSaleType;
  url?: string;
  is_hype?: boolean;
  image?: BeatportImage;
}

export interface BeatportCurrentStatus {
  id: number;
  name: string;
  url: string;
}

export interface BeatportSaleType {
  id: number;
  name: string;
  url: string;
}

export interface BeatportArtist {
  id: number;
  name: string;
  slug: string;
  image?: BeatportImage;
  url?: string;
  biography?: string;
  facebook_url?: string;
  twitter_url?: string;
  soundcloud_url?: string;
  instagram_url?: string;
  spotify_url?: string;
  beatport_url?: string;
}

export interface BeatportRelease {
  id: number;
  name: string;
  slug: string;
  image?: BeatportImage;
  label: BeatportLabel;
  artists?: BeatportArtist[];
  release_date?: string;
  publish_date?: string;
  track_count?: number;
  catalog_number?: string;
  upc?: string;
  grid?: string;
  price?: BeatportPrice;
  desc?: string;
  is_exclusive?: boolean;
  exclusive_period?: string;
  pre_order?: boolean;
  pre_order_date?: string;
}

export interface BeatportLabel {
  id: number;
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
  id: number;
  name: string;
  slug: string;
  url?: string;
}

export interface BeatportKey {
  id: number;
  name: string;
  camelot_number?: number;
  camelot_letter?: string;
  chord_type?: {
    id: number;
    name: string;
    url: string;
  };
  is_sharp?: boolean;
  is_flat?: boolean;
  letter?: string;
  url?: string;
  open_key?: string;
  standard?: string;
}

export interface BeatportImage {
  id: number;
  uri: string;
  dynamic_uri?: string;
}

export interface BeatportPrice {
  code: string;
  symbol: string;
  value: number;
  display: string;
}

export interface BeatportChart {
  id: number;
  name: string;
  slug: string;
  image?: BeatportImage;
  genre?: BeatportGenre;
  sub_genre?: BeatportGenre;
  desc?: string;
  tracks: BeatportTrack[];
}

export interface BeatportUser {
  id: number;
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