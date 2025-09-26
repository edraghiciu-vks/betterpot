import { Show, createEffect } from 'solid-js';
import { TracksTable } from '@betterpot/ui-kit';
import { useSearch } from '../../stores/search';
import { usePlayer } from '../../stores/player';
import type { BeatportTrack } from '@betterpot/shared-types';
import '../../styles/TracksTable.css';

export const Search = () => {
  const { state: searchState, handlePageChange } = useSearch();
  
  // Get player context
  const { play } = usePlayer();

  // Debug effect to log search state changes
  createEffect(() => {
    console.log('Search state:', {
      isLoading: searchState.isLoading,
      hasResults: !!searchState.results,
      resultsCount: searchState.results?.results?.length || 0,
      searchParams: searchState.searchParams,
      error: searchState.error
    });
  });

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

  return (
    <div class="search max-w-7xl mx-auto p-4">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Search Results</h2>
        
        {/* Error Display */}
        <Show when={searchState.error}>
          <div class="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            <p class="font-medium">Search Error</p>
            <p class="text-sm">{searchState.error}</p>
          </div>
        </Show>
      </div>

      {/* Results */}
      <div class="search-results">
        <Show when={searchState.searchParams && !searchState.isLoading && !searchState.error && searchState.results?.results.length === 0}>
          <div class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-4">🔍</div>
            <h3 class="text-xl font-medium mb-2">No tracks found</h3>
            <p>Try searching for different keywords or adjust your search terms.</p>
          </div>
        </Show>

        <Show when={!searchState.searchParams && !searchState.isLoading}>
          <div class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-4">🎵</div>
            <h3 class="text-xl font-medium mb-2">Start searching for music</h3>
            <p>Use the search bar above to find tracks, artists, and releases.</p>
          </div>
        </Show>

        <Show when={searchState.results || searchState.isLoading}>
          <div class="mb-4">
            <TracksTable
              tracks={searchState.results?.results || []}
              isLoading={searchState.isLoading}
              currentPage={searchState.searchParams?.page || 1}
              totalPages={searchState.results?.total_pages || 0}
              totalTracks={searchState.results?.count || 0}
              onPageChange={handlePageChange}
              onPlayTrack={handlePlayTrack}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};