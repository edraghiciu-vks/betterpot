// TypeScript types for Beatport API
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
}

export interface SearchResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface TrackSearchResponse extends SearchResponse<Track> {
  tracks: Track[];
}

export interface ReleaseSearchResponse extends SearchResponse<Release> {
  releases: Release[];
}

export interface ArtistSearchResponse extends SearchResponse<Artist> {
  artists: Artist[];
}

export interface SearchFilters {
  genre?: string[];
  sub_genre?: string[];
  bpm_range?: [number, number];
  key?: string[];
  release_date_range?: [string, string];
  label?: string[];
  artist?: string[];
  sort?: 'release_date' | 'bpm' | 'name' | 'artist' | 'label';
  per_page?: number;
  page?: number;
}