import { createSignal, createResource } from 'solid-js';
import { Resizable, ResizablePanel, ResizableHandle } from '@betterpot/ui-kit';
import { beatportApiService, ApiError } from '../services/beatportApi';
import { usePlayer } from '../stores/player';
import type { SearchTracksResponse, BeatportTrack } from '@betterpot/shared-types';
import { SearchField } from '../components/Search/SearchField';
import { SearchResults } from '../components/Search/SearchResults';
import { Crates } from '../components/Crates/Crates';

interface SearchParams {
  query: string;
  page: number;
  per_page: number;
}

const SearchPage = () => {
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
      preview_duration: previewDurationSeconds > 0 ? previewDurationSeconds : undefined,
      // Preserve metadata for the player
      bpm: beatportTrack.bpm,
      key: beatportTrack.key ? {
        name: beatportTrack.key.name,
        camelot_number: beatportTrack.key.camelot_number,
        camelot_letter: beatportTrack.key.camelot_letter
      } : undefined,
      genre: beatportTrack.genre ? {
        name: beatportTrack.genre.name
      } : undefined,
      sub_genre: beatportTrack.sub_genre ? {
        name: beatportTrack.sub_genre.name
      } : undefined,
      label: beatportTrack.release?.label ? {
        name: beatportTrack.release.label.name
      } : undefined
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

  return (
    <div class="page-container h-full">
      <Resizable orientation="horizontal" class="h-full">
        <ResizablePanel initialSize={0.25} minSize={0.2} maxSize={0.4}>
          <SearchField
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() => handleSearch(1)}
            isLoading={searchResults.loading}
            error={error}
            setError={setError}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel initialSize={0.5} minSize={0.3}>
          <SearchResults
            searchResults={searchResults}
            isLoading={searchResults.loading}
            searchParams={searchParams}
            error={error}
            onPageChange={handlePageChange}
            onPlayTrack={handlePlayTrack}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel initialSize={0.25} minSize={0.2} maxSize={0.4}>
          <Crates />
        </ResizablePanel>
      </Resizable>
    </div>
  );
}

export default SearchPage