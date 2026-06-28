# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 monorepo using pnpm workspaces and Turbo for task orchestration. The project
implements a composable layers-based architecture for building scalable Vue applications. Each layer
is an independent package that can be used standalone or composed with others.

## Commands

```bash
# Development
pnpm dev                                  # Start the playground dev server (all layers loaded)
PLAYGROUND_LAYERS=core,ui pnpm dev        # Load specific layers only

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
│   ├── core/               # Base utilities, 404, loading — always the foundation
│   │
│   ├── seo/                # @nuxtjs/seo wrapper (robots, sitemap, og-image, schema-org)
│   ├── scripts/            # @nuxt/scripts wrapper (analytics, GTM, embeds)
│   │
│   ├── typography/         # Typography components + useTypography, useColor
│   ├── navigation/         # Mast/Site/Links components + useMastNav, useSite
│   ├── visual/             # Accent, Gradient, Tint, Progress, Modal, Picture
│   ├── ui/                 # UI orchestrator → typography + navigation + visual
│   │
│   ├── layout/             # Page layout (grid, spacing, breakpoints)
│   │
│   ├── scroll/             # GSAP + Locomotive Scroll + scroll-reactive components
│   ├── animations/         # Marquee, Cursor, Tilt, Magnetic, CountUp, TextReveal
│   ├── transitions/        # CSS transition classes + MotionTransition component
│   ├── page-transitions/   # Nuxt page transition defaults + usePageTransition
│   ├── motion/             # Motion orchestrator → scroll + animations + transitions + page-transitions
│   │
│   ├── canvas/             # TresJS/WebGL/WebGPU rendering context
│   ├── shader/             # TSL shader pipeline blocks, materials, presets
│   │
│   ├── mailer/             # Resend email sending + runtime config
│   ├── forms/              # Form UI + Zod validation (depends on mailer)
│   │
│   ├── database/           # Drizzle + Neon Postgres connection, useDrizzle() helper
│   ├── auth/               # nuxt-auth-utils + GitHub OAuth, session utilities
│   │
│   ├── theme/              # Design tokens and theming utilities
│   ├── content/            # Nuxt Content v3 collections and components
│   └── routing/            # Advanced routing, maintenance mode, feature flags
└── packages/               # Shared utilities (placeholder)
```

## Layer Dependency Graph

```
core → (nothing)

seo → core
scripts → core

typography → core
navigation → core, scroll, layout, typography
visual → core
ui → typography, navigation, visual

layout → core

scroll → core
animations → scroll
transitions → core
page-transitions → core
motion → scroll, animations, transitions, page-transitions

canvas → core
shader → canvas

mailer → core
forms → mailer

database → core
auth → core

theme → core
content → core
routing → core
```

**Rules:**
- `core` has no layer dependencies — it is always the base
- Every non-core layer MUST declare its full `extends` list explicitly in `nuxt.config.ts`
- Do not rely on playground load order to provide dependencies
- Nuxt deduplicates layers, so declaring a dep that's already loaded is safe and free

## Tech Stack

- **Nuxt 4** / Vue 3 / TypeScript 5.9
- **@nuxt/ui** with Tailwind CSS 4
- **GSAP** + **Locomotive Scroll** for scroll and animation
- **TresJS** (Three.js) for 3D/WebGL/WebGPU
- **Resend** for transactional email
- **Zod** for form validation
- **@nuxtjs/seo** for robots, sitemap, og-image, schema-org
- **@nuxt/scripts** for consent-aware third-party scripts
- **Turbo** for monorepo task running
- **Vitest** for unit tests, **Playwright/Cypress** for E2E

## Path-Based Rules

Detailed coding conventions are in `.claude/rules/`:
- `vue-components.md` — Vue SFC patterns (applies to `**/*.vue`)
- `nuxt-layers.md` — Layer development (applies to `layers/**/*`)
- `typescript.md` — TypeScript conventions (applies to `**/*.ts`, `**/*.tsx`)
