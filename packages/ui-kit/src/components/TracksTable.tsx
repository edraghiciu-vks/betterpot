import { JSX, Show, For } from 'solid-js';
import { Button } from './Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './table';
import type { BeatportTrack } from '@betterpot/shared-types';
import './TracksTable.css';

interface TracksTableProps {
  tracks: BeatportTrack[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  totalTracks: number;
  onPageChange: (page: number) => void;
  onPlayTrack?: (track: BeatportTrack) => void;
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
      <div class="pagination-container">
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
            <span class="pagination-ellipsis">…</span>
          </Show>
        </Show>

        <For each={pages()}>
          {(page) => (
            <Button
              variant={page === props.currentPage ? 'default' : 'ghost'}
              onClick={() => props.onPageChange(page)}
            >
              {page}
            </Button>
          )}
        </For>

        <Show when={pages().length > 0 && pages()[pages().length - 1]! < props.totalPages}>
          <Show when={pages().length > 0 && pages()[pages().length - 1]! < props.totalPages - 1}>
            <span class="pagination-ellipsis">…</span>
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
  <TableRow class="loading-row">
    <TableCell>
      <div class="loading-artwork-placeholder"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-75"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-50"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-50"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-33"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-64"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-64"></div>
    </TableCell>
    <TableCell>
      <div class="loading-placeholder loading-placeholder-80"></div>
    </TableCell>
  </TableRow>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={8} class="empty-state">
      <div>
        <div class="empty-state-icon">🎵</div>
        <p class="empty-state-title">No tracks found</p>
        <p class="empty-state-message">Try adjusting your search criteria</p>
      </div>
    </TableCell>
  </TableRow>
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
    <div class="tracks-table-container">
      {/* Results summary */}
      <Show when={!props.isLoading && props.tracks.length > 0}>
        <div class="tracks-table-summary">
          Showing {((props.currentPage - 1) * props.tracks.length) + 1} to {(props.currentPage - 1) * props.tracks.length + props.tracks.length} of {props.totalTracks} tracks
        </div>
      </Show>

      {/* Table */}
      <Table class="tracks-table">
        <TableHeader class="tracks-table-header">
          <TableRow>
            <TableHead class="play-column w-16">Play</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>BPM</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                <TableRow class="tracks-table-row">
                  <TableCell class="tracks-table-cell">
                    <div class="track-artwork-container">
                      <Show 
                        when={track.release?.image?.uri} 
                        fallback={
                          <div class="track-artwork-placeholder">
                            🎵
                          </div>
                        }
                      >
                        <img
                          src={track.release!.image!.uri}
                          alt={`${track.name} artwork`}
                          class="track-artwork"
                          onClick={() => props.onPlayTrack?.(track)}
                          title={`Play "${track.name}"`}
                          loading="lazy"
                        />
                        <div 
                          class="track-artwork-overlay"
                          onClick={() => props.onPlayTrack?.(track)}
                        >
                          <span class="track-artwork-play-button">▶️</span>
                        </div>
                      </Show>
                    </div>
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    <div>
                      <div class="track-name">
                        {track.name}
                        <Show when={track.mix_name}>
                          <span class="track-mix-name">({track.mix_name})</span>
                        </Show>
                      </div>
                      <div class="track-duration">
                        {track.length || formatDuration(track.length_ms)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    {formatArtists(track.artists)}
                    <Show when={track.remixers && track.remixers.length > 0}>
                      <div class="track-remix">
                        Remix: {formatArtists(track.remixers!)}
                      </div>
                    </Show>
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    {track.release.label.name}
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    {track.genre.name}
                    <Show when={track.sub_genre}>
                      <div class="track-subgenre">
                        {track.sub_genre!.name}
                      </div>
                    </Show>
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    {track.bpm || '—'}
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    {track.key?.name || '—'}
                    <Show when={track.key?.camelot_number}>
                      <div class="track-camelot">
                        {track.key!.camelot_number}{track.key!.camelot_letter}
                      </div>
                    </Show>
                  </TableCell>
                  <TableCell class="tracks-table-cell">
                    <div class="track-price">
                      <div class="track-price-amount">
                        {track.price.display}
                      </div>
                      <a
                        href={getBeatportUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="track-buy-link"
                      >
                        Buy on Beatport →
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </For>
          </Show>
        </TableBody>
      </Table>

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