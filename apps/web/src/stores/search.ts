// Search store - SolidJS Store for global search state
import { createContext, useContext, createSignal, createResource } from 'solid-js'
import { beatportApiService, ApiError } from '../services/beatportApi'
import type { SearchTracksResponse } from '@betterpot/shared-types'

export interface SearchParams {
  query: string
  page: number
  per_page: number
}

export interface SearchState {
  searchQuery: string
  searchParams: SearchParams | null
  error: string | null
  results: SearchTracksResponse | null
  isLoading: boolean
}

interface SearchContextType {
  state: SearchState
  setSearchQuery: (query: string) => void
  performSearch: (page?: number) => void
  handlePageChange: (page: number) => void
  clearError: () => void
  clearResults: () => void
}

const SearchContext = createContext<SearchContextType>()

export function SearchProvider(props: { children: any }) {
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchParams, setSearchParams] = createSignal<SearchParams | null>(null)
  const [error, setError] = createSignal<string | null>(null)

  // Create resource for search results
  const [searchResults] = createResource(
    searchParams,
    async (params: SearchParams) => {
      try {
        setError(null)
        const response: SearchTracksResponse = await beatportApiService.searchTracks({
          query: params.query,
          page: params.page,
          per_page: params.per_page
        })
        return response
      } catch (err) {
        let errorMessage = 'Failed to search tracks. Please try again.'
        if (err instanceof ApiError) {
          errorMessage = err.message
          if (err.status === 401) {
            errorMessage = 'Authentication failed. Please check your API configuration.'
          } else if (err.status === 500) {
            errorMessage = 'Server error. Please try again later.'
          }
        }
        setError(errorMessage)
        throw err
      }
    }
  )

  const state: SearchState = {
    get searchQuery() { return searchQuery() },
    get searchParams() { return searchParams() },
    get error() { return error() },
    get results() { return searchResults() || null },
    get isLoading() { return searchResults.loading }
  }

  const performSearch = (page: number = 1) => {
    const query = searchQuery().trim()
    if (!query) {
      setError('Please enter a search query')
      return
    }

    setSearchParams({
      query,
      page,
      per_page: 100
    })
  }

  const handlePageChange = (page: number) => {
    const currentParams = searchParams()
    if (currentParams) {
      setSearchParams({
        ...currentParams,
        page
      })
    }
  }

  const clearError = () => {
    setError(null)
  }

  const clearResults = () => {
    setSearchParams(null)
  }

  const contextValue: SearchContextType = {
    state,
    setSearchQuery,
    performSearch,
    handlePageChange,
    clearError,
    clearResults
  }

  // Return the context provider with proper SolidJS API
  return SearchContext.Provider({
    value: contextValue,
    get children() { return props.children }
  })
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}