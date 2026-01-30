# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 monorepo using pnpm workspaces and Turbo for task orchestration. The project implements a layers-based architecture for building scalable Vue applications.

## Commands

```bash
# Development
pnpm dev                    # Start all dev servers via Turbo
pnpm -F playground dev      # Start only the playground app

# Build & Type Check
pnpm build                  # Build all packages
pnpm typecheck              # Type check all packages
pnpm lint                   # Lint all packages

# Cleanup
pnpm clean                  # Remove node_modules, .nuxt, dist from all packages
```

## Architecture

```
nuxt-layers/
├── apps/
│   └── playground/         # Demo/development Nuxt app
├── layers/
│   ├── core/              # Core layer (base utilities)
│   ├── layout/            # Layout components layer
│   └── ui/                # UI components layer
└── packages/              # Shared utilities (placeholder)
```

**Nuxt Layers Pattern:** Each layer in `layers/` is an independent package that can be composed into Nuxt apps. Layers extend the app with components, composables, utilities, and configuration.

## Tech Stack

- **Nuxt 4** / Vue 3 / TypeScript 5.9
- **@nuxt/ui** with Tailwind CSS 4
- **Turbo** for monorepo task running
- **Vitest** for unit tests, **Playwright/Cypress** for E2E
- **Changesets** for versioning

## Path-Based Rules

Detailed coding conventions are in `.claude/rules/`:
- `vue-components.md` - Vue SFC patterns (applies to `**/*.vue`)
- `nuxt-layers.md` - Layer development (applies to `layers/**/*`)
- `typescript.md` - TypeScript conventions (applies to `**/*.ts`, `**/*.tsx`)
