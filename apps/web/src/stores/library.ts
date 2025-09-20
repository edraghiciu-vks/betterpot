// Library store - Music library state management
import { createContext, useContext, createSignal } from 'solid-js'

export interface LibraryState {
  tracks: any[]
  releases: any[]
  artists: any[]
  isLoading: boolean
  searchQuery: string
  filters: {
    genre?: string
    bpm?: number
    key?: string
  }
}

interface LibraryContextType {
  state: LibraryState
  search: (query: string) => void
  setFilters: (filters: any) => void
  loadTracks: () => void
  loadReleases: () => void
}

const LibraryContext = createContext<LibraryContextType>()

export function LibraryProvider(props: { children: any }) {
  const [tracks, setTracks] = createSignal<any[]>([])
  const [releases, setReleases] = createSignal<any[]>([])
  const [artists, setArtists] = createSignal<any[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const [searchQuery, setSearchQuery] = createSignal('')
  const [filters, setFiltersSignal] = createSignal<any>({})

  const state: LibraryState = {
    get tracks() { return tracks() },
    get releases() { return releases() },
    get artists() { return artists() },
    get isLoading() { return isLoading() },
    get searchQuery() { return searchQuery() },
    get filters() { return filters() }
  }

  const search = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    // TODO: Implement actual search logic
    setTimeout(() => setIsLoading(false), 1000)
  }

  const setFilters = (newFilters: any) => {
    setFiltersSignal(newFilters)
  }

  const loadTracks = () => {
    setIsLoading(true)
    // TODO: Implement actual track loading
    setTimeout(() => {
      setTracks([{ id: '1', name: 'Sample Track' }])
      setIsLoading(false)
    }, 1000)
  }

  const loadReleases = () => {
    setIsLoading(true)
    // TODO: Implement actual release loading
    setTimeout(() => {
      setReleases([{ id: '1', name: 'Sample Release' }])
      setIsLoading(false)
    }, 1000)
  }

  const contextValue: LibraryContextType = {
    state,
    search,
    setFilters,
    loadTracks,
    loadReleases
  }

  return LibraryContext.Provider({ 
    value: contextValue, 
    children: props.children
  })
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider')
  }
  return context
}