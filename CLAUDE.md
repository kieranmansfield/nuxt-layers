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

## Code Style

- **No semicolons**, single quotes, ES5 trailing commas
- **Max line length:** 100 characters
- **Vue script blocks:** Must use `lang="ts"`
- **Component names:** PascalCase in templates
- **Vue block order:** `<script>` → `<template>` → `<style>`

### Vue Macros

Use type-based declarations with destructuring:

```vue
<script setup lang="ts">
// Correct: type-based with destructuring
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  update: [value: string]
}>()
</script>
```

Macro ordering: `defineProps` → `defineEmits` → `defineExpose` → `withDefaults`

## Tech Stack

- **Nuxt 4** / Vue 3 / TypeScript 5.9
- **@nuxt/ui** with Tailwind CSS 4
- **Turbo** for monorepo task running
- **Vitest** for unit tests, **Playwright/Cypress** for E2E
- **Changesets** for versioning
