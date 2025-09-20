import { JSX, Show, For } from 'solid-js';
import { Button } from './Button';
import type { BeatportTrack } from '@betterpot/shared-types';

interface TracksTableProps {
  tracks: BeatportTrack[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  totalTracks: number;
  onPageChange: (page: number) => void;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = (props: PaginationControlsProps) => {
  const pages = () => {
    const result = [];
    const maxVisiblePages = 5;
    
    // Calculate start and end page numbers for pagination
    let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      result.push(i);
    }
    return result;
  };

  return (
    <Show when={props.totalPages > 1}>
      <div class="flex items-center justify-center gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={() => props.onPageChange(1)}
          disabled={props.currentPage === 1}
          title="First page"
        >
          «
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => props.onPageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          title="Previous page"
        >
          ‹
        </Button>

        <Show when={pages().length > 0 && pages()[0]! > 1}>
          <Button variant="ghost" onClick={() => props.onPageChange(1)}>
            1
          </Button>
          <Show when={pages().length > 0 && pages()[0]! > 2}>
            <span class="px-2 text-gray-500">…</span>
          </Show>
        </Show>

        <For each={pages()}>
          {(page) => (
            <Button
              variant={page === props.currentPage ? 'primary' : 'ghost'}
              onClick={() => props.onPageChange(page)}
            >
              {page}
            </Button>
          )}
        </For>

        <Show when={pages().length > 0 && pages()[pages().length - 1]! < props.totalPages}>
          <Show when={pages().length > 0 && pages()[pages().length - 1]! < props.totalPages - 1}>
            <span class="px-2 text-gray-500">…</span>
          </Show>
          <Button variant="ghost" onClick={() => props.onPageChange(props.totalPages)}>
            {props.totalPages}
          </Button>
        </Show>

        <Button
          variant="secondary"
          onClick={() => props.onPageChange(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
          title="Next page"
        >
          ›
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => props.onPageChange(props.totalPages)}
          disabled={props.currentPage === props.totalPages}
          title="Last page"
        >
          »
        </Button>
      </div>
    </Show>
  );
};

const LoadingRow = () => (
  <tr class="animate-pulse">
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-3/4"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-1/2"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-1/2"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-1/3"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-16"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-16"></div>
    </td>
    <td class="p-3 border-b border-gray-700">
      <div class="h-4 bg-gray-600 rounded w-20"></div>
    </td>
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan={7} class="p-8 text-center text-gray-400">
      <div class="flex flex-col items-center">
        <div class="text-4xl mb-2">🎵</div>
        <p class="text-lg font-medium">No tracks found</p>
        <p class="text-sm">Try adjusting your search criteria</p>
      </div>
    </td>
  </tr>
);

export const TracksTable = (props: TracksTableProps) => {
  const formatDuration = (lengthMs: number) => {
    const totalSeconds = Math.floor(lengthMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatArtists = (artists: BeatportTrack['artists']) => {
    return artists.map((artist) => artist.name).join(', ');
  };

  const getBeatportUrl = (track: BeatportTrack) => {
    return `https://beatport.com/track/${track.slug}/${track.id}`;
  };

  return (
    <div class="w-full">
      {/* Results summary */}
      <Show when={!props.isLoading && props.tracks.length > 0}>
        <div class="mb-4 text-sm text-gray-400">
          Showing {((props.currentPage - 1) * props.tracks.length) + 1} to {(props.currentPage - 1) * props.tracks.length + props.tracks.length} of {props.totalTracks} tracks
        </div>
      </Show>

      {/* Table */}
      <div class="overflow-x-auto bg-gray-800 rounded-lg">
        <table class="w-full min-w-[800px]">
          <thead class="bg-gray-700">
            <tr>
              <th class="text-left p-3 font-medium text-gray-200">Track</th>
              <th class="text-left p-3 font-medium text-gray-200">Artist</th>
              <th class="text-left p-3 font-medium text-gray-200">Label</th>
              <th class="text-left p-3 font-medium text-gray-200">Genre</th>
              <th class="text-left p-3 font-medium text-gray-200">BPM</th>
              <th class="text-left p-3 font-medium text-gray-200">Key</th>
              <th class="text-left p-3 font-medium text-gray-200">Purchase</th>
            </tr>
          </thead>
          <tbody>
            <Show when={props.isLoading}>
              <For each={Array.from({ length: 10 })}>
                {() => <LoadingRow />}
              </For>
            </Show>
            
            <Show when={!props.isLoading && props.tracks.length === 0}>
              <EmptyState />
            </Show>
            
            <Show when={!props.isLoading}>
              <For each={props.tracks}>
                {(track) => (
                  <tr class="hover:bg-gray-700 transition-colors">
                    <td class="p-3 border-b border-gray-700">
                      <div>
                        <div class="font-medium text-white">
                          {track.name}
                          <Show when={track.mix_name}>
                            <span class="text-gray-400 ml-1">({track.mix_name})</span>
                          </Show>
                        </div>
                        <div class="text-xs text-gray-400 mt-1">
                          {track.length || formatDuration(track.length_ms)}
                        </div>
                      </div>
                    </td>
                    <td class="p-3 border-b border-gray-700 text-gray-300">
                      {formatArtists(track.artists)}
                      <Show when={track.remixers && track.remixers.length > 0}>
                        <div class="text-xs text-gray-500 mt-1">
                          Remix: {formatArtists(track.remixers!)}
                        </div>
                      </Show>
                    </td>
                    <td class="p-3 border-b border-gray-700 text-gray-300">
                      {track.release.label.name}
                    </td>
                    <td class="p-3 border-b border-gray-700 text-gray-300">
                      {track.genre.name}
                      <Show when={track.sub_genre}>
                        <div class="text-xs text-gray-500 mt-1">
                          {track.sub_genre!.name}
                        </div>
                      </Show>
                    </td>
                    <td class="p-3 border-b border-gray-700 text-gray-300">
                      {track.bpm || '—'}
                    </td>
                    <td class="p-3 border-b border-gray-700 text-gray-300">
                      {track.key?.name || '—'}
                      <Show when={track.key?.camelot_number}>
                        <div class="text-xs text-gray-500 mt-1">
                          {track.key!.camelot_number}{track.key!.camelot_letter}
                        </div>
                      </Show>
                    </td>
                    <td class="p-3 border-b border-gray-700">
                      <div class="flex flex-col gap-1">
                        <div class="text-sm font-medium text-green-400">
                          {track.price.display}
                        </div>
                        <a
                          href={getBeatportUrl(track)}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Buy on Beatport →
                        </a>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Show when={!props.isLoading && props.tracks.length > 0}>
        <PaginationControls
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          onPageChange={props.onPageChange}
        />
      </Show>
    </div>
  );
};