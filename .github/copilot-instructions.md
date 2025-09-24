# Betterpot - GitHub Copilot Coding Agent Instructions

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## 🎵 Project Overview

Betterpot is an ultra-fast audio player with Beatport integration built as a **monorepo using Bun + TypeScript**. The project consists of:

- **Core Innovation**: Scrapes Beatport's public client_id from their documentation (similar to beets-beatport4 plugin) to access their API without official credentials
- **Architecture**: Turborepo monorepo with Bun workspaces, SolidJS frontend, Hono.js API backend
- **Test Coverage**: 82/82 tests passing with 100% coverage on critical auth/API components

## 🏗️ Repository Structure

```
apps/api/                   # Hono.js API server (port 8001)  
apps/web/                   # SolidJS frontend app (port 3000)
packages/betterpot-client/  # Core Beatport API client library
packages/shared-types/      # Shared TypeScript type definitions
packages/ui-kit/           # Reusable SolidJS UI components
```

**CRITICAL**: Packages must be built before apps can use them. Always run `bun run build:packages` after package changes.

## 🛠️ Essential Development Commands

### Initial Setup
```bash
# Install Bun runtime (if not available)
curl -fsSL https://bun.sh/install | bash && source ~/.bashrc

# Bootstrap project (after git clone)
bun install                 # Takes ~15 seconds
bun run build:packages      # Takes ~5 seconds - TypeScript compilation

# Or use combined setup command  
bun run setup               # Equivalent to install + build:packages
```

### Development Workflow
```bash
# Start development servers
bun run dev                 # Both API (8001) + Web (3000) in parallel
bun run dev:api            # API server only on port 8001
bun run dev:web            # Web frontend only on port 3000

# Building
bun run build              # Build all packages and apps - typically takes ~3 seconds (can take much longer on first run or in CI, so timeout is set to 30+ minutes; do not cancel)
bun run build:packages     # Build packages only - takes ~5 seconds

# Testing - NEVER CANCEL, timeout 30+ minutes  
bun test                   # All tests passing - completes in <1 second
bun test --watch           # Watch mode for development
bun test token-manager.test.ts  # Specific test file

# Code Quality
bun run type-check         # TypeScript checking - takes ~11 seconds - NEVER CANCEL, timeout 30+ minutes
bun run lint              # Currently only runs TypeScript compilation
```

### Build and Test Timing Expectations
- **NEVER CANCEL** any build or test commands - they may appear to hang but will complete
- **bun install**: 15 seconds (first time), <1 second (subsequent)
- **bun run build:packages**: 5 seconds (from source), cached builds <1 second  
- **bun run build**: 3 seconds (full application build with Vite)
- **bun test**: <1 second (all 82 tests)
- **bun run type-check**: 11 seconds (with known type error in web app)
- **Development server startup**: 1-2 seconds each

## 📋 Manual Validation Scenarios

After making changes, ALWAYS test these scenarios to ensure functionality:

### 1. API Server Validation
```bash
# Start API server
cd apps/api && bun --env-file=../../.env --watch src/index.ts

# Test health endpoint (in another terminal)
curl http://localhost:8001/health
# Expected: {"status":"ok","timestamp":"..."}
```

### 2. Web App Validation  
```bash
# Start web server
cd apps/web && bun run dev

# Access http://localhost:3000 in browser
# Expected: SolidJS app loads with Header, routing works
# Validate: Navigation between Home, Library, Search pages works
# UI Elements: Header with "Betterpot Music Player", navigation links, player interface
```

### 3. Package Development Validation
```bash
# After changing packages/betterpot-client/src/
bun run build:packages
cd packages/betterpot-client && bun test
# Expected: All 46 API client tests pass
```

### 4. Authentication Flow Testing
The Beatport API client uses a 2-method authentication strategy:
```bash
# Method 1: Automatic (scrapes client_id + OAuth2)
BEATPORT_USERNAME=your_username BEATPORT_PASSWORD=your_password bun run index.ts

# Method 2: Manual token fallback  
BEATPORT_TOKEN='{"access_token":"...","expires_in":36000}' bun run index.ts
```

## 🔑 Key Implementation Details

### Beatport API Authentication (`packages/betterpot-client/`)
- **Client ID Scraping**: Fetches from `https://api.beatport.com/v4/docs/` JavaScript files
- **Token Persistence**: Saves to `beatport_token.json` with 5-minute expiry buffer
- **Cookie-based OAuth**: Maintains session across login → authorize → token requests

### Error Patterns to Expect
- **Client ID Scraping Fails**: Beatport changed their documentation structure
- **Auth Flow Breaks**: OAuth redirect handling is complex, may need manual token fallback  
- **Token Expiry**: Always check `TokenManager.getValidToken()` first
- **Type Error in Web App**: Known issue in `src/components/Search/Search.tsx` (invalid Button variant in the Search component)

### Frontend Architecture (SolidJS)
- **State Management**: Context providers in `apps/web/src/stores/` (auth, player, library)
- **Routing**: Uses `@solidjs/router` with routes: `/`, `/library`, `/search`
- **Audio**: Uses `wavesurfer.js` for audio visualization and playback
- **UI Framework**: Custom UI kit with Tailwind CSS and Kobalte components

## 🧪 Testing Strategy

**100% Test Coverage** on critical components with realistic mocks:

```bash
# Package-level tests (no live API calls)
cd packages/betterpot-client && bun test  # 46/46 tests
cd apps/web && bun test                   # 21/21 tests  
cd apps/api && bun test                   # 15/15 tests
```

**Test Categories:**
- **TokenManager**: File I/O, expiry logic, validation (23 tests)
- **BeatportAPI**: Auth flows, token handling, API requests (23 tests)  
- **Web Components**: Search, player, library state management (21 tests)
- **API Routes**: Request handling, pagination, error cases (15 tests)

## 🔧 Configuration

### Environment Variables (.env in repo root)
```bash
# Method 1: Automatic authentication (preferred)
BEATPORT_USERNAME=your_username
BEATPORT_PASSWORD=your_password

# Method 2: Manual token (backup)  
BEATPORT_TOKEN={"access_token":"...","expires_in":36000}

# Optional overrides
BEATPORT_CLIENT_ID=custom_client_id
FRONTEND_URL=http://localhost:3000
PORT=8001  # API server port
```

### TypeScript Project Structure
Build order matters due to dependencies:
1. `shared-types` (no dependencies)
2. `betterpot-client` (uses shared-types)  
3. `ui-kit` (uses shared-types)
4. Apps (use all packages)

## 🚨 Common Issues and Solutions

### 1. "Package not found" errors
```bash
# Always build packages first
bun run build:packages
```

### 2. "bun: command not found"  
```bash
# Ensure Bun is in PATH
export PATH="$HOME/.bun/bin:$PATH"
# Or reinstall: curl -fsSL https://bun.sh/install | bash
```

### 3. Type errors in web app
Known issue in `apps/web/src/components/Search/Search.tsx:142`:
- Button variant "primary" doesn't exist, should be one of: "default", "destructive", "outline", "secondary", "ghost", "link"

### 4. Authentication issues
```bash
# Check token file exists and is valid
cat beatport_token.json
# Check environment variables are set
echo $BEATPORT_USERNAME
```

### 5. Development server not starting
```bash
# Ensure packages are built first
bun run build:packages
# Check ports aren't already in use
lsof -i :3000 -i :8001
```

## 🎯 Common Development Tasks

### Adding New API Endpoints
1. Add route in `apps/api/src/routes/`
2. Add types in `packages/shared-types/src/`
3. Build packages: `bun run build:packages`
4. Add corresponding frontend service in `apps/web/src/services/`
5. Test with `bun test`

### Adding New UI Components  
1. Create component in `packages/ui-kit/src/components/`
2. Export from `packages/ui-kit/src/index.ts`
3. Build packages: `bun run build:packages`
4. Use in web app: `import { Component } from '@betterpot/ui-kit'`

### Working with Beatport API
```typescript
// Typical usage pattern
const api = new BeatportAPI(username, password);
await api.initialize(); // Try existing token first
if (!api.getAccessToken()) {
  await api.authenticateWithPassword(); // Fallback to login
}
const tracks = await api.searchTracks("house music");
```

## 📁 Key File Locations

### Configuration Files
- `package.json` - Root package with workspace configuration
- `turbo.json` - Turborepo build pipeline configuration  
- `tsconfig.json` - Root TypeScript configuration
- `.env` - Environment variables (create from examples in README)

### Critical Implementation Files
- `packages/betterpot-client/src/index.ts` - Main API client
- `packages/betterpot-client/src/token-manager.ts` - Token persistence
- `apps/api/src/index.ts` - API server entry point
- `apps/web/src/main.tsx` - Web app entry point
- `apps/web/src/stores/` - Frontend state management

### Test Files
- `packages/betterpot-client/tests/` - API client tests (46 tests)
- `apps/web/src/__tests__/` - Frontend component tests (21 tests)
- `apps/api/src/routes/__tests__/` - API route tests (15 tests)

## 🚀 Next Development Priorities

The foundation is solid with working API client + comprehensive tests. Focus areas:

1. **Fix Type Error**: Resolve Button variant issue in Search component
2. **Audio Player Enhancement**: Improve wavesurfer.js integration
3. **Search UI**: Add real-time search with debouncing  
4. **Playlist Management**: Local storage + API synchronization
5. **OAuth Proxy**: Simplify authentication flow in API server

**Always maintain test coverage** when adding features - the API integration is the hardest part and it's already solved with 100% test coverage.