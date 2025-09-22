import { createSignal, createResource, Show } from 'solid-js';
import { Button, Input, TracksTable } from '@betterpot/ui-kit';
import { beatportApiService, ApiError } from '../../services/beatportApi';
import { usePlayer } from '../../stores/player';
import type { SearchTracksResponse, BeatportTrack } from '@betterpot/shared-types';

interface SearchParams {
  query: string;
  page: number;
  per_page: number;
}

export const Search = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchParams, setSearchParams] = createSignal<SearchParams | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  
  // Get player context
  const { play } = usePlayer();

  // Convert BeatportTrack to player Track format
  const convertToPlayerTrack = (beatportTrack: BeatportTrack) => {
    // Calculate preview duration from Beatport metadata
    const previewDurationMs = (beatportTrack.sample_end_ms || 0) - (beatportTrack.sample_start_ms || 0)
    const previewDurationSeconds = previewDurationMs / 1000
    
    return {
      id: beatportTrack.id.toString(),
      name: beatportTrack.name,
      artists: beatportTrack.artists.map(artist => artist.name),
      preview_url: beatportTrack.sample_url,
      duration: 0, // Duration will be set by WaveSurfer when track loads
      artwork_url: beatportTrack.release?.image?.uri,
      mix_name: beatportTrack.mix_name,
      preview_duration: previewDurationSeconds > 0 ? previewDurationSeconds : undefined
    };
  };

  const handlePlayTrack = (beatportTrack: BeatportTrack) => {
    const playerTrack = convertToPlayerTrack(beatportTrack);
    play(playerTrack);
  };

  // Create resource for search results
  const [searchResults] = createResource(
    searchParams,
    async (params: SearchParams) => {
      try {
        setError(null);
        const response: SearchTracksResponse = await beatportApiService.searchTracks({
          query: params.query,
          page: params.page,
          per_page: params.per_page
        });
        return response;
      } catch (err) {
        let errorMessage = 'Failed to search tracks. Please try again.';
        if (err instanceof ApiError) {
          errorMessage = err.message;
          if (err.status === 401) {
            errorMessage = 'Authentication failed. Please check your API configuration.';
          } else if (err.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
        setError(errorMessage);
        throw err;
      }
    }
  );

  const handleSearch = (page: number = 1) => {
    const query = searchQuery().trim();
    if (!query) {
      setError('Please enter a search query');
      return;
    }

    setSearchParams({
      query,
      page,
      per_page: 100
    });
  };

  const handlePageChange = (page: number) => {
    const currentParams = searchParams();
    if (currentParams) {
      setSearchParams({
        ...currentParams,
        page
      });
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(1);
    }
  };

  return (
    <div class="search max-w-7xl mx-auto p-4">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Search Music</h2>
        
        {/* Search Input */}
        <div class="flex gap-3 max-w-2xl">
          <div class="flex-1">
            <Input
              type="text"
              placeholder="Search tracks, artists, releases..."
              value={searchQuery()}
              onChange={(e: Event) => {
                const target = e.target as HTMLInputElement;
                setSearchQuery(target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              disabled={searchResults.loading}
            />
          </div>
          <Button
            onClick={() => handleSearch(1)}
            disabled={searchResults.loading || !searchQuery().trim()}
            variant="primary"
          >
            {searchResults.loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Error Display */}
        <Show when={error()}>
          <div class="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            <p class="font-medium">Search Error</p>
            <p class="text-sm">{error()}</p>
          </div>
        </Show>
      </div>

      {/* Results */}
      <div class="search-results">
        <Show when={searchParams() && !searchResults.loading && !error() && searchResults()?.results.length === 0}>
          <div class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-4">🔍</div>
            <h3 class="text-xl font-medium mb-2">No tracks found</h3>
            <p>Try searching for different keywords or adjust your search terms.</p>
          </div>
        </Show>

        <Show when={searchResults() || searchResults.loading}>
          <div class="mb-4">
            <TracksTable
              tracks={searchResults()?.results || []}
              isLoading={searchResults.loading}
              currentPage={searchParams()?.page || 1}
              totalPages={searchResults()?.total_pages || 0}
              totalTracks={searchResults()?.count || 0}
              onPageChange={handlePageChange}
              onPlayTrack={handlePlayTrack}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};