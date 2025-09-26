import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { AuthProvider, useAuth } from './stores/auth'
import { PlayerProvider } from './stores/player'
import { LibraryProvider } from './stores/library'
import { SearchProvider } from './stores/search'

// Layout Components
import { Header } from './components/Layout/Header'
import { StickyWaveSurferPlayer } from './components/Player/StickyWaveSurferPlayer'
import { ErrorDialog } from './components/ErrorDialog'

// Page Components
import Home from './pages/Home'
import LibraryPage from './pages/LibraryPage'
import SearchPage from './pages/SearchPage'
import './styles/global.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

// Error dialog component that uses auth context
const AppErrorDialog = () => {
  const { state, clearApiError } = useAuth()
  
  return (
    <ErrorDialog
      isOpen={!!state.apiError}
      title="API Error"
      message={state.apiError || ''}
      onClose={clearApiError}
    />
  )
}

// Layout component that wraps all routes
const App = (props: any) => {
  return (
    <AuthProvider>
      <SearchProvider>
        <PlayerProvider>
          <LibraryProvider>
            <div class="app">
              {/* Header stays on all pages */}
              <Header />
              
              {/* Sticky WaveSurfer player appears below header when track is playing */}
              <StickyWaveSurferPlayer />
              
              {/* Main content area - changes based on route */}
              <main class="main-content">
                {props.children}
              </main>
              
              {/* Global error dialog - inside AuthProvider context */}
              <AppErrorDialog />
            </div>
          </LibraryProvider>
        </PlayerProvider>
      </SearchProvider>
    </AuthProvider>
  )
}

render(() => (
  <Router root={App}>
    <Route path="/" component={Home} />
    <Route path="/library" component={LibraryPage} />
    <Route path="/search" component={SearchPage} />
  </Router>
), root!)