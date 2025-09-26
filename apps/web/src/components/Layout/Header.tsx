// Header component with SolidJS Router navigation
import { A, useNavigate } from '@solidjs/router'
import { Show } from 'solid-js'
import { useAuth } from '../../stores/auth'
import { useSearch } from '../../stores/search'
import { Flex, Avatar, AvatarFallback, AvatarImage, TextField, TextFieldInput } from '@betterpot/ui-kit'

export const Header = () => {
  const { state } = useAuth()
  const { state: searchState, setSearchQuery, performSearch, clearError } = useSearch()
  const navigate = useNavigate()

  const handleSearch = (e: Event) => {
    e.preventDefault()
    const query = searchState.searchQuery.trim()
    if (query) {
      performSearch(1)
      // Navigate to search page to show results
      navigate('/search')
    }
  }

  const handleSearchInput = (e: InputEvent) => {
    const target = e.currentTarget as HTMLInputElement
    setSearchQuery(target.value)
    clearError()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const query = searchState.searchQuery.trim()
      if (query) {
        performSearch(1)
        navigate('/search')
      }
    }
  }

  return (
    <header class="bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <div class="container mx-auto px-4 py-3">
        <Flex justifyContent="between" alignItems="center" class="w-full gap-4">
          {/* Left: Beatport Account Info */}
          <div class="flex items-center gap-3 min-w-0 flex-shrink-0">
            <Show 
              when={!state.isLoading && state.user}
              fallback={
                <Show when={state.isLoading}>
                  <div class="flex items-center gap-3">
                    <div class="size-8 animate-pulse rounded-full bg-white/20" />
                    <span class="text-sm text-white/70">Loading...</span>
                  </div>
                </Show>
              }
            >
              <Avatar class="size-8">
                <AvatarImage src="" alt={state.user?.name || state.user?.username} />
                <AvatarFallback class="bg-white/20 text-white text-sm font-medium">
                  {(state.user?.name || state.user?.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm font-medium text-white truncate">
                  {state.user?.name || state.user?.username}
                </span>
                <Show when={state.user?.dj_profile}>
                  <span class="text-xs font-medium text-white bg-white/20 px-1.5 py-0.5 rounded">
                    DJ
                  </span>
                </Show>
              </div>
            </Show>
            
            <Show when={!state.isLoading && !state.user && state.apiError}>
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-full bg-white/20" />
                <span class="text-sm text-white/70">Auth failed</span>
              </div>
            </Show>
          </div>

          {/* Center: Search Bar - Takes up most of the space */}
          <div class="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} class="relative flex items-center">
              <TextField class="flex-1">
                <TextFieldInput
                  type="search"
                  placeholder="Search tracks, artists, labels..."
                  value={searchState.searchQuery}
                  onInput={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  class="w-full bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-white/50 pr-10"
                />
              </TextField>
              <button
                type="submit"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                aria-label="Search"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right: Library Link */}
          <div class="flex-shrink-0">
            <A 
              href="/library" 
              class="text-white/90 hover:text-white text-sm font-medium"
            >
              Library
            </A>
          </div>
        </Flex>
      </div>
    </header>
  )
}