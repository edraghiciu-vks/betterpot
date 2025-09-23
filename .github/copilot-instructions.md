# Betterpot - Ultra-Fast Audio Player Development Instructions

**CRITICAL: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## 🎵 Project Overview
Betterpot is a monorepo-based ultra-fast audio player with Beatport API integration, built with **Bun + TypeScript + Turborepo**. The architecture provides music discovery and player functionality using a client-side approach to access Beatport's API through public client ID scraping.

## 🏗️ Repository Architecture

### Monorepo Structure (Turborepo + Bun Workspaces)
```
/home/runner/work/betterpot/betterpot/
├── apps/
│   ├── api/          # Hono.js API server (port 8001)
│   └── web/          # SolidJS frontend with Vite (port 3000)
├── packages/
│   ├── betterpot-client/   # Core Beatport API client
│   ├── shared-types/       # Shared TypeScript definitions  
│   └── ui-kit/            # Reusable SolidJS UI components
└── .github/
    └── instructions/       # Additional specialized instructions
```

**CRITICAL BUILD ORDER**: Packages must be built before apps can use them. Always run `bun run build:packages` after package changes.

## 🛠️ Essential Development Setup

### Prerequisites Installation
```bash
# Install Bun runtime (required - NOT Node.js)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version  # Should show 1.2.22+
```

### Repository Bootstrap Commands
```bash
# Initial setup after fresh clone
cd /home/runner/work/betterpot/betterpot
bun install                    # Install all dependencies - takes ~16s
bun run build:packages         # Build shared packages first - takes ~3.8s
```

## 🚀 Development Workflow

### Core Development Commands (ALWAYS use Bun, never Node.js)
```bash
# Development servers
bun run dev                    # Both API + web in parallel
bun run dev:api               # API server only (port 8001)
bun run dev:web               # Frontend only (port 3000)

# Building (NEVER CANCEL - Set 10+ minute timeouts)
bun run build                 # Full build - takes ~6.6s, NEVER CANCEL
bun run build:packages        # Packages only - takes ~3.8s, NEVER CANCEL

# Testing (NEVER CANCEL - Set 5+ minute timeouts)  
bun test                      # All tests - takes ~0.16s, 82/82 passing
bun test --watch              # Watch mode for development
bun test token-manager.test.ts # Specific test file

# Type checking and linting
bun run lint                  # Type check all packages - takes ~3.8s
bun run type-check            # TypeScript validation only
```

### Development URLs (Always Available After Setup)
- **Web App**: http://localhost:3000
- **API Server**: http://localhost:8001  
- **API Health**: http://localhost:8001/health

## 🔧 Build System Timing & Expectations

**CRITICAL - NEVER CANCEL THESE OPERATIONS:**

| Command | Expected Time | Timeout Setting | Notes |
|---------|---------------|-----------------|-------|
| `bun install` | ~16 seconds | 5 minutes | Initial dependency installation |
| `bun run build:packages` | ~3.8 seconds | 2 minutes | Required before app builds |
| `bun run build` | ~6.6 seconds | 10 minutes | Full monorepo build |
| `bun test` | ~0.16 seconds | 2 minutes | 82 tests, 100% pass rate |
| `bun run lint` | ~3.8 seconds | 5 minutes | TypeScript validation |

**WARNING**: Build warnings about Node.js modules (fs, path) in web build are NORMAL and expected - the frontend uses server-side packages that get externalized by Vite.

## 🧪 Testing & Validation

### Test Coverage & Reliability
- **100% test pass rate**: 82/82 tests passing
- **Comprehensive mocking**: No live API calls in tests
- **Realistic scenarios**: TokenManager (23 tests), BeatportAPI (23 tests), UI components (36 tests)

### Always Test After Changes
```bash
# Run full test suite after any modifications
bun test  # Expected: 82 pass, 0 fail in ~0.16s

# Test specific areas
bun test token-manager.test.ts     # Authentication & persistence logic
bun test beatport-api.test.ts      # API client functionality  
bun test search.test.ts            # Search component logic
```

### Manual Validation Scenarios
After making changes, always validate these scenarios:

1. **API Server Health Check**:
   ```bash
   curl http://localhost:8001/health
   # Expected: {"status":"ok","timestamp":"..."}
   ```

2. **Authentication System Validation**:
   ```bash
   curl -s "http://localhost:8001/search/tracks?query=test" 
   # Expected: {"error":"Query parameter \"q\" is required"} (proper error handling)
   ```

3. **Package Build Dependency Chain**:
   ```bash
   # Must work in this order
   bun run build:packages  # Packages first
   bun run build          # Then full build
   ```

## 🔑 Authentication Architecture

### Two-Method Strategy (Beatport API Access)
1. **Automatic (Preferred)**: `BeatportAPI.authenticateWithPassword()` - scrapes client_id from Beatport docs
2. **Manual Fallback**: Uses `BEATPORT_TOKEN` environment variable

### Environment Configuration (.env)
```bash
# Method 1: Automatic authentication (recommended)
BEATPORT_USERNAME=your_username
BEATPORT_PASSWORD=your_password

# Method 2: Manual token (backup method)
BEATPORT_TOKEN={"access_token":"...","expires_in":36000}

# Optional overrides
BEATPORT_CLIENT_ID=custom_client_id
FRONTEND_URL=http://localhost:3000
```

**Token Persistence**: Tokens auto-save to `beatport_token.json` via `TokenManager` with 5-minute expiry buffer.

## 📦 Package Development Workflow

### Making Changes to Packages
1. Edit files in `packages/*/src/`
2. Run `bun run build:packages` to rebuild
3. Changes automatically available in apps (workspace linking)
4. Run tests: `bun test` to validate changes

### Key Package Responsibilities
- **`@betterpot/shared-types`**: TypeScript definitions, no dependencies
- **`@betterpot/betterpot-client`**: Core API logic, uses shared-types
- **`@betterpot/ui-kit`**: SolidJS components, uses shared-types

## 🚨 Critical Development Rules

### Always Use Bun (Not Node.js)
- ✅ `bun install` ❌ `npm install`
- ✅ `bun test` ❌ `npm test` or `jest`
- ✅ `bun run dev` ❌ `npm run dev`
- ✅ `bun build` ❌ `webpack` or `esbuild`

### Build Order Dependencies
- Always build `packages/` before `apps/`
- Shared-types → betterpot-client → ui-kit → apps
- Use `bun run build:packages` when workspace linking fails

### Never Cancel Long Operations
- Builds may appear to hang but are processing - wait for completion
- Set explicit timeouts of 10+ minutes for build operations
- All timings documented above are actual measured values

## 🎯 Common Development Tasks

### After Fresh Clone
```bash
cd /home/runner/work/betterpot/betterpot
bun install && bun run build:packages
bun test  # Verify 82/82 tests pass
```

### Making API Changes
```bash
# Edit files in apps/api/src/
bun run dev:api  # Test changes
curl http://localhost:8001/health  # Validate
```

### Making Frontend Changes  
```bash
# Edit files in apps/web/src/
bun run dev:web  # Test changes with hot reload
# Frontend will be available at http://localhost:3000
```

### Package Development
```bash
# Edit files in packages/*/src/
bun run build:packages  # Rebuild packages
bun test  # Validate changes
```

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

1. **"Module not found" errors**: Run `bun run build:packages` first
2. **Build warnings about Node.js modules**: Normal for frontend - external modules get stubbed
3. **Authentication failures**: Check `.env` file exists with valid credentials
4. **Port conflicts**: API uses 8001, frontend uses 3000 (not 8000 as docs might suggest)

### Validation Commands to Run First
```bash
bun --version        # Should be 1.2.22+
bun install         # Should complete without errors  
bun run build       # Should build in ~6.6s
bun test           # Should show 82 pass, 0 fail
```

## 📁 File System Locations

### Important Files & Folders
- **Main entry**: `/home/runner/work/betterpot/betterpot/` (repository root)
- **API source**: `apps/api/src/index.ts` (Hono.js server)
- **Web source**: `apps/web/src/` (SolidJS frontend)
- **Core client**: `packages/betterpot-client/src/` (Beatport API)
- **Configuration**: `package.json`, `turbo.json`, `tsconfig.json`
- **Token storage**: `beatport_token.json` (auto-generated)

### Always Check These After Changes
- Run `bun test` to ensure 82/82 tests pass
- Check `curl http://localhost:8001/health` after API changes
- Verify package builds: `bun run build:packages`
- Validate TypeScript: `bun run type-check`

**The foundation is solid with working API integration and 100% test coverage. Focus on building features while maintaining the existing test quality.**