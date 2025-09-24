# Monorepo Dependency Management Strategy

This document outlines the proper dependency management strategy for the Betterpot monorepo.

## Repository Structure

```
betterpot/
├── apps/                    # Application consumers
│   ├── api/                # Hono API server
│   └── web/                # SolidJS web app
└── packages/               # Library providers
    ├── shared-types/       # Common TypeScript types
    ├── betterpot-client/   # Beatport API client
    └── ui-kit/             # Reusable UI components
```

## Dependency Management Principles

### 1. **Scope Dependencies to Their Usage**
- Dependencies should only be declared where they are actually used
- Avoid duplicate dependencies between root and packages
- Root-level dependencies should only be for build tooling and configuration

### 2. **Current Root Dependencies** (Build System Only)
- `autoprefixer` - PostCSS plugin for CSS processing
- `postcss` - CSS transformation tool
- `tailwindcss` - CSS framework (used by config files)
- `tailwindcss-animate` - Tailwind plugin for animations

### 3. **Package-Specific Dependencies**

#### packages/ui-kit
- `@kobalte/core` - Solid.js component primitives
- `class-variance-authority` - CSS class variant system
- `clsx` - Conditional CSS class utility
- `tailwind-merge` - Tailwind CSS class merging
- `solid-js` - UI framework dependency

#### packages/betterpot-client
- No external dependencies (uses Bun/Node.js built-ins)

#### packages/shared-types
- No external dependencies (pure TypeScript types)

## Workspace Dependencies

All internal package references use the `workspace:*` pattern:

```json
{
  "dependencies": {
    "@betterpot/ui-kit": "workspace:*",
    "@betterpot/shared-types": "workspace:*",
    "@betterpot/betterpot-client": "workspace:*"
  }
}
```

## Verification Commands

To ensure the monorepo is properly configured:

```bash
# Install dependencies
bun install

# Build all packages (dependencies first)
bun run build:packages

# Build everything including apps
bun run build

# Run all tests
bun run test

# Type check all packages
bun run type-check
```

## Fixed Issues

- ✅ Removed duplicate UI dependencies from root package.json
- ✅ UI dependencies (`@kobalte/core`, `class-variance-authority`, `clsx`, `tailwind-merge`) now only in ui-kit
- ✅ Removed unused `@tanstack/solid-table` dependency
- ✅ Fixed ui-kit build to copy CSS files alongside TypeScript compilation
- ✅ Verified workspace dependency resolution works correctly
- ✅ All tests continue passing (82 total across all packages)

## Best Practices

1. **Add Dependencies at the Right Level**: Only add dependencies to packages that directly use them
2. **Use Workspace References**: Always use `workspace:*` for internal package dependencies
3. **Keep Root Clean**: Root should only have build tools and configuration dependencies
4. **Verify Builds**: Always run `bun run build:packages` after dependency changes
5. **Test Everything**: Run full test suite to ensure changes don't break functionality

This strategy ensures clean separation of concerns, optimal build performance, and easier maintenance.