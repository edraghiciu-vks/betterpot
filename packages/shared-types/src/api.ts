// API Request/Response types
export interface APIResponse<T = any> {
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
}

export interface SearchFilters {
  genre?: string[];
  sub_genre?: string[];
  bpm_range?: [number, number];
  key?: string[];
  release_date_range?: [string, string];
  label?: string[];
  artist?: string[];
  sort?: 'release_date' | 'bpm' | 'name' | 'artist' | 'label' | 'popularity';
  per_page?: number;
  page?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}