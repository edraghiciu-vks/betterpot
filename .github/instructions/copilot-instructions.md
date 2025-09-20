# Betterpot - AI Coding Agent Instructions

## 🎵 Project Overview
This is a **Beatport API client monorepo** built with **Bun + TypeScript** that provides music discovery and player functionality. The core innovation is **scraping Beatport's public client_id** (like beets-beatport4 plugin) to access their API without official credentials.

## 🏗️ Architecture Patterns

### Monorepo Structure (Turborepo + Bun Workspaces)
```
apps/api/          # Hono.js API server (port 8000)
apps/web/          # React/SolidJS frontend (port 3000)
packages/betterpot-client/   # Core Beatport API client
packages/shared-types/       # Shared TypeScript definitions
packages/ui-kit/            # Reusable UI components
```

**Key insight**: Packages must be built before apps can use them. Always run `bun run build:packages` after package changes.

### Authentication Architecture
The project implements **2-method auth strategy** mimicking beets-beatport4:

1. **Automatic (Preferred)**: `BeatportAPI.authenticateWithPassword()` - scrapes client_id, handles OAuth2 flow
2. **Manual Fallback**: `BeatportAPI.authenticateWithManualToken()` - uses BEATPORT_TOKEN env var

**Critical**: Tokens are persisted in `beatport_token.json` via `TokenManager` class with 5-minute expiry buffer.

## 🛠️ Development Workflow

### Essential Commands (Use Bun, NOT Node.js)
```bash
# Setup (after git clone)
bun install && bun run build:packages

# Development (parallel apps)
bun run dev                    # Both API + web
bun run dev:api               # API server only
bun run dev:web               # Frontend only

# Testing (comprehensive suite)
bun test                      # All packages (46/46 tests)
bun test --watch              # Watch mode
bun test token-manager.test.ts # Specific test

# Building
bun run build                 # Everything
bun run build:packages        # Packages first (required!)
```

### Package Development Pattern
1. Make changes in `packages/*/src/`
2. Run `bun run build:packages` to rebuild
3. Changes automatically available in apps (workspace linking)
4. Tests in `packages/*/tests/` use realistic mocks, no API calls

## 🔑 Key Implementation Details

### Beatport API Integration (`packages/betterpot-client/`)
- **Client ID Scraping**: Fetches from `https://api.beatport.com/v4/docs/` JS files, searches for `API_CLIENT_ID` pattern
- **Cookie-based OAuth**: Maintains session across login → authorize → token requests
- **Token Persistence**: `TokenManager` saves to `beatport_token.json`, validates expiry with buffer

```typescript
// Typical API usage pattern
const api = new BeatportAPI(username, password);
await api.initialize(); // Try existing token first
if (!api.getAccessToken()) {
  await api.authenticateWithPassword(); // Fallback to login
}
const tracks = await api.searchTracks("house music");
```

### Error Patterns to Expect
- **Client ID Scraping Fails**: Beatport changed their docs structure
- **Auth Flow Breaks**: OAuth redirect handling is complex, may need manual token fallback
- **Token Expiry**: Always check `TokenManager.getValidToken()` first

### Frontend Architecture (React/SolidJS Migration)
- **State Management**: Context providers in `apps/web/src/stores/` (auth, player, library)
- **Component Structure**: Layout → Features → UI Kit components
- **Audio**: Planned Howler.js integration for playback

## 🧪 Testing Strategy

**100% Test Coverage** (46/46 passing) with realistic mocks:
- `TokenManager`: File I/O, expiry logic, validation
- `BeatportAPI`: Auth flows, token handling, API requests
- **No live API calls** in tests - all mocked with typical responses

Run tests after any auth logic changes: `bun test`

## 🔧 Configuration Patterns

### Environment Variables (.env)
```bash
# Method 1: Automatic auth
BEATPORT_USERNAME=your_username
BEATPORT_PASSWORD=your_password

# Method 2: Manual token (backup)
BEATPORT_TOKEN={"access_token":"...","expires_in":36000}

# Optional overrides
BEATPORT_CLIENT_ID=custom_client_id
FRONTEND_URL=http://localhost:3000
```

### TypeScript Project References
Each package has `tsconfig.json` with proper references. Build order matters:
1. `shared-types` (no dependencies)
2. `betterpot-client` (uses shared-types)
3. `ui-kit` (uses shared-types)
4. Apps (use all packages)

## 🚨 Common Gotchas

1. **Always use Bun commands** (not npm/node) per `CLAUDE.md` guidelines
2. **Build packages first** when workspace linking fails
3. **Check existing token** before authenticating (avoid rate limits)
4. **Mock API calls** in tests - token file I/O is OK to test for real
5. **Handle auth gracefully** - method 1 may fail, method 2 is backup

## 🎯 Next Development Priorities

The foundation is solid with working API client + tests. Focus areas:
1. **Audio Player**: Howler.js integration in `apps/web/`
2. **Search UI**: Real-time search in `packages/ui-kit/components/`
3. **OAuth Proxy**: Simplify auth flow in `apps/api/routes/auth.ts`
4. **Playlist Management**: Local storage + API sync

**Always maintain test coverage** when adding features - the API integration is the hardest part and it's already solved.