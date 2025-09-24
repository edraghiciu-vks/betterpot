import { Button, Input } from '@betterpot/ui-kit';
import { Show } from 'solid-js';

interface SearchFieldProps {
  searchQuery: () => string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: () => string | null;
  setError: (error: string | null) => void;
}

export const SearchField = (props: SearchFieldProps) => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onSearch();
    }
  };

  return (
    <div class="search-field p-4 h-full bg-gray-900/50 border border-gray-700 rounded-lg">
      <h3 class="text-lg font-semibold text-white mb-4">Search Music</h3>
      
      {/* Search Input */}
      <div class="space-y-3">
        <Input
          type="text"
          placeholder="Search tracks, artists, releases..."
          value={props.searchQuery()}
          onChange={(e: Event) => {
            const target = e.target as HTMLInputElement;
            props.setSearchQuery(target.value);
            props.setError(null);
          }}
          onKeyPress={handleKeyPress}
          disabled={props.isLoading}
        />
        
        <Button
          onClick={props.onSearch}
          disabled={props.isLoading || !props.searchQuery().trim()}
          variant="default"
          class="w-full"
        >
          {props.isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Error Display */}
      <Show when={props.error()}>
        <div class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          <p class="font-medium text-sm">Search Error</p>
          <p class="text-xs mt-1">{props.error()}</p>
        </div>
      </Show>
    </div>
  );
};