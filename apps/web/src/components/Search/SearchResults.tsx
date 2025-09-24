import { Show } from 'solid-js';
import { TracksTable } from '@betterpot/ui-kit';
import type { SearchTracksResponse, BeatportTrack } from '@betterpot/shared-types';

interface SearchResultsProps {
  searchResults: () => SearchTracksResponse | undefined;
  isLoading: boolean;
  searchParams: () => { query: string; page: number; per_page: number } | null;
  error: () => string | null;
  onPageChange: (page: number) => void;
  onPlayTrack: (track: BeatportTrack) => void;
}

export const SearchResults = (props: SearchResultsProps) => {
  return (
    <div class="search-results p-4 h-full bg-gray-900/50 border border-gray-700 rounded-lg overflow-auto">       
      <Show when={props.searchParams() && !props.isLoading && !props.error() && props.searchResults()?.results.length === 0}>
        <div class="text-center py-12 text-gray-400">
          <div class="text-4xl mb-4">🔍</div>
          <h4 class="text-lg font-medium mb-2">No tracks found</h4>
          <p class="text-sm">Try searching for different keywords or adjust your search terms.</p>
        </div>
      </Show>

      <Show when={!props.searchParams() && !props.isLoading}>
        <div class="text-center py-12 text-gray-400">
          <div class="text-4xl mb-4">🎵</div>
          <h4 class="text-lg font-medium mb-2">Ready to search</h4>
          <p class="text-sm">Enter a search query to find tracks.</p>
        </div>
      </Show>

      <Show when={props.searchResults() || props.isLoading}>
        <div class="h-full">
          <TracksTable
            tracks={props.searchResults()?.results || []}
            isLoading={props.isLoading}
            currentPage={props.searchParams()?.page || 1}
            totalPages={props.searchResults()?.total_pages || 0}
            totalTracks={props.searchResults()?.count || 0}
            onPageChange={props.onPageChange}
            onPlayTrack={props.onPlayTrack}
          />
        </div>
      </Show>
    </div>
  );
};