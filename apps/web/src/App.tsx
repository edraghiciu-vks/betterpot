// Main App Component - Simplified placeholder
// TODO: Add SolidJS routing and components once packages are installed

import { AuthProvider } from './stores/auth'
import { PlayerProvider } from './stores/player'
import { LibraryProvider } from './stores/library'

// Components
import { Header } from './components/Layout/Header'
import { Player } from './components/Player/Player'
import { Library } from './components/Library/Library'

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <LibraryProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Library />
            </main>
            <Player />
          </div>
        </LibraryProvider>
      </PlayerProvider>
    </AuthProvider>
  )
}

export default App