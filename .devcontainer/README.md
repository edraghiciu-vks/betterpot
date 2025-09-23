# Betterpot Development Container

This devcontainer configuration provides a complete development environment for the Betterpot audio player project with all necessary tools and dependencies.

## What's Included

### Runtime & Package Management
- **Bun** - Primary runtime and package manager (latest version)
- **Node.js 20** - Fallback compatibility and some tooling
- **npm/npx** - Available for packages that require npm

### Development Tools
- **TypeScript** - Type checking and compilation
- **Turbo** - Monorepo task management  
- **Git** - Version control with latest features
- **GitHub CLI** - Repository management
- **Zsh + Oh My Zsh** - Enhanced shell experience

### VS Code Extensions
- **TypeScript** - Advanced TypeScript support
- **Bun for VS Code** - Bun runtime integration
- **Tailwind CSS** - CSS framework support
- **Prettier** - Code formatting
- **Auto Rename Tag** - HTML/JSX tag management
- **Playwright** - E2E testing support

## Port Configuration

The devcontainer automatically forwards these ports:

- **3000** - Web app (Vite development server)
- **8000** - API server (Hono)
- **8001** - API server alternate port
- **5173** - Vite dev server alternate port

## Quick Start

1. **Open in GitHub Codespaces**: Click the "Code" button → "Codespaces" → "Create codespace"

2. **Wait for setup**: The container will automatically:
   - Install Bun runtime
   - Install all project dependencies
   - Build shared packages
   - Configure development tools

3. **Start development**:
   ```bash
   # Start both API and web app
   bun run dev
   
   # Or start services individually
   bun run dev:api  # API server on port 8000
   bun run dev:web  # Web app on port 3000
   ```

## Available Commands

```bash
# Development
bun run dev          # Start both API and web app in parallel
bun run dev:api      # Start API server only
bun run dev:web      # Start web app only

# Building
bun run build        # Build all packages and apps
bun run build:packages # Build shared packages only

# Testing
bun run test         # Run all tests
bun run test:watch   # Run tests in watch mode

# Utilities  
bun run lint         # Lint all code
bun run type-check   # Type check all TypeScript
bun run clean        # Clean build artifacts
```

## Project Structure

```
betterpot/
├── apps/
│   ├── api/         # Hono API server
│   └── web/         # SolidJS web application
├── packages/
│   ├── betterpot-client/  # Beatport API client
│   ├── shared-types/      # Shared TypeScript types
│   └── ui-kit/           # Shared UI components
└── .devcontainer/    # Development container config
```

## Audio Development Notes

This project includes advanced audio features:

- **Web Audio API** - Browser-native audio processing
- **Superpowered SDK** - Professional audio engine (planned)
- **AudioWorklets** - Low-latency audio processing
- **WASM Support** - High-performance audio modules

The devcontainer includes headers and configuration for SharedArrayBuffer support, which is required for advanced audio features.

## Troubleshooting

### Bun Installation Issues
If Bun fails to install, you can manually install it:
```bash
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
```

### Port Conflicts
If ports 3000 or 8000 are already in use, the applications will automatically try alternative ports (3001, 8001, etc.).

### Build Failures
Make sure to build packages first:
```bash
bun run build:packages
```

### VS Code Extension Issues
Reload the window if extensions don't activate properly:
- `Ctrl+Shift+P` → "Developer: Reload Window"

## Performance Tips

- **Volume Mounts**: The devcontainer uses a volume mount for `node_modules` to improve performance
- **TypeScript**: The container includes the latest TypeScript for optimal type checking
- **Git**: Configured for optimal performance with large repositories

---

🎵 **Ready to build the fastest music player on the web!** 🚀