#!/bin/bash

# Test script to verify devcontainer setup works correctly
# This can be used to test the setup locally before committing

echo "🧪 Testing Betterpot devcontainer setup..."

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Not in project root directory"
    exit 1
fi

# Check if devcontainer files exist
if [[ ! -f ".devcontainer/devcontainer.json" ]]; then
    echo "❌ devcontainer.json not found"
    exit 1
fi

if [[ ! -f ".devcontainer/setup.sh" ]]; then
    echo "❌ setup.sh not found"
    exit 1
fi

# Validate JSON syntax
if ! python3 -m json.tool .devcontainer/devcontainer.json > /dev/null 2>&1; then
    echo "❌ devcontainer.json has invalid JSON syntax"
    exit 1
fi

# Check if setup script is executable
if [[ ! -x ".devcontainer/setup.sh" ]]; then
    echo "❌ setup.sh is not executable"
    exit 1
fi

# Check if key package.json scripts exist
if ! grep -q '"dev"' package.json; then
    echo "❌ dev script not found in package.json"
    exit 1
fi

if ! grep -q '"build:packages"' package.json; then
    echo "❌ build:packages script not found in package.json"
    exit 1
fi

# Check monorepo structure
if [[ ! -d "apps/api" ]]; then
    echo "❌ apps/api directory not found"
    exit 1
fi

if [[ ! -d "apps/web" ]]; then
    echo "❌ apps/web directory not found"
    exit 1
fi

if [[ ! -d "packages" ]]; then
    echo "❌ packages directory not found"
    exit 1
fi

echo "✅ All devcontainer setup tests passed!"
echo "🚀 Ready for GitHub Codespaces deployment"