// Header component with SolidJS Router navigation
import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { useAuth } from '../../stores/auth'
import './Header.css'

export const Header = () => {
  const { state } = useAuth()

  return (
    <header class="header">
      <div class="header__brand">
        <h1 class="header__title">Betterpot Music Player</h1>
      </div>
      
      <nav class="header__nav">
        <A href="/" activeClass="active" class="header__nav-link">Home</A>
        <A href="/library" activeClass="active" class="header__nav-link">Library</A>
        <A href="/search" activeClass="active" class="header__nav-link">Search</A>
      </nav>

      <div class="header__user">
        <Show when={state.isLoading}>
          <span class="header__loading">Loading user...</span>
        </Show>
        
        <Show when={!state.isLoading && state.user}>
          <div class="header__user-info">
            <span class="header__username">
              Welcome, {state.user?.name || state.user?.username}
            </span>
            
            <Show when={state.user?.dj_profile}>
              <span class="header__dj-badge">DJ</span>
            </Show>
          </div>
        </Show>
        
        <Show when={!state.isLoading && !state.user && state.apiError}>
          <span class="header__error">Failed to load user</span>
        </Show>
      </div>
    </header>
  )
}