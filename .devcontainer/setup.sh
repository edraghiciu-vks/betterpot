#!/bin/bash

# Betterpot Devcontainer Setup Script
set -e

echo "🎵 Setting up Betterpot development environment..."

# Install Bun if not already installed
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    # Make bun available system-wide
    sudo ln -sf "$HOME/.bun/bin/bun" /usr/local/bin/bun
    sudo ln -sf "$HOME/.bun/bin/bunx" /usr/local/bin/bunx
else
    echo "✅ Bun is already installed"
fi

# Verify Bun installation
echo "🔍 Verifying Bun installation..."
bun --version

# Install dependencies
echo "📋 Installing project dependencies..."
bun install

# Build shared packages first
echo "🏗️ Building shared packages..."
bun run build:packages

# Setup complete
echo "✅ Setup complete! You can now run:"
echo "  - bun run dev        # Start both API and web app"
echo "  - bun run dev:api    # Start API server only"  
echo "  - bun run dev:web    # Start web app only"
echo "  - bun run test       # Run all tests"
echo "  - bun run build      # Build all packages and apps"

echo ""
echo "🚀 Happy coding with Betterpot!"