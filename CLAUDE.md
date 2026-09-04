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
PLAYGROUND_LAYERS=core,typography pnpm dev  # Load specific layers only

# Build & Type Check
pnpm build                  # Build all packages
pnpm typecheck              # Type check all packages
pnpm lint                   # Lint all packages

# Cleanup
pnpm clean                  # Remove node_modules, .nuxt, dist from all packages
```

## Architecture

Layers are organized by build-workflow tier (foundation → design system → structure → content →
data → motion → render → delivery) rather than flat domain buckets. Tiers with more than one
layer get a physical tier-parent folder under `layers/`; a tier with exactly one layer skips the
extra nesting and that layer sits directly under `layers/` (`core`, `content`) — a tier-parent
folder holding a single same-named child (`core/core`, `content/content`) added a path segment
with no information in it. This grouping and the audit/decision history behind it live in
`docs/superpowers/specs/2026-08-30-layer-taxonomy-tier-{0-1,2,3,4,5,6,7}-design.md` — read those
for the "why", this file only tracks current structure.

```
nuxt-layers/
├── apps/
│   ├── playground/         # Demo/development Nuxt app (all layers loadable via PLAYGROUND_LAYERS)
│   └── starter/            # Standalone starter/demo app — not a layer, lives outside layers/
├── layers/
│   ├── core/                       # Tier 0 — Foundation (single layer, no tier-parent folder)
│   │                                 Base utilities, 404, loading, design tokens, Element/ElementTw
│   │                                 polymorphic primitives (layout/spacing/sizing/surface/
│   │                                 interaction vocabulary) — always the foundation
│   │
│   ├── design-system/              # Tier 1
│   │   ├── theming/                 # Accent/contrast/motion/transparency preferences, ThemePicker UI
│   │   ├── typography/              # Typography components + useTypography, useColor
│   │   └── visual/                  # Accent, Gradient, Tint, Progress, Modal, Picture
│   │
│   ├── structure/                  # Tier 2
│   │   ├── layout/                  # Grid/spacing/breakpoints + HStack/VStack/ZStack/Spacer primitives
│   │   ├── navigation/              # Mast/Site/Links components + useMastNav, useSite
│   │   └── routing/                 # Advanced routing, maintenance mode, feature flags
│   │
│   ├── content/                    # Tier 3 (single layer, no tier-parent folder)
│   │                                 Nuxt Content v3 collections and components
│   │
│   ├── data/                       # Tier 4
│   │   ├── database/                # Drizzle + Neon Postgres connection, useDrizzle() helper
│   │   ├── auth/                     # nuxt-auth-utils + GitHub OAuth, session utilities
│   │   ├── metadata/                 # Provider registry, cache, normalised types, API routes
│   │   │   └── providers/
│   │   │       ├── comicvine/           # Comic Vine provider (issues, volumes)
│   │   │       ├── openlibrary/         # Open Library provider (books, ISBNs)
│   │   │       ├── google-books/        # Google Books provider (fallback/enrichment)
│   │   │       └── themoviedb/          # TMDB provider (movies, TV shows; IMDB ID passthrough)
│   │   ├── forms/                    # Form UI + Zod validation (depends on mailer)
│   │   └── mailer/                   # Resend email sending + runtime config
│   │
│   ├── motion/                     # Tier 5 — still has the same `motion/motion` self-nesting as
│   │   ├── scroll/                   # `content` did; deliberately left alone for now (see below)
│   │   ├── animations/               # GSAP + Locomotive Scroll + scroll-reactive components
│   │   ├── transitions/              # CSS transition classes + MotionTransition component
│   │   ├── page-transitions/         # Nuxt page transition defaults + usePageTransition
│   │   └── motion/                   # Motion orchestrator → scroll + animations + transitions + page-transitions
│   │
│   ├── render/                     # Tier 6
│   │   ├── canvas/                   # TresJS/WebGL/WebGPU rendering context
│   │   └── shader/                   # TSL shader pipeline blocks, materials, presets
│   │
│   └── delivery/                   # Tier 7
│       ├── seo/                      # @nuxtjs/seo wrapper (robots, sitemap, og-image, schema-org)
│       ├── scripts/                  # @nuxt/scripts wrapper (analytics, GTM, embeds, baseline-status badge)
│       └── feeds/                    # RSS/Atom/JSON feed generation from content collections
└── packages/               # Shared utilities (placeholder)
```

Each layer's package name (`kmcom-layer-*`, used in `pnpm --filter`/`turbo --filter`) is unchanged
by any of this — only folder paths changed.

**Open item, not yet decided:** Tier 5 (Motion) still nests its orchestrator layer as
`motion/motion`, the same redundant shape `core` and `content` were just pulled out of. Left alone
deliberately — motion has other real siblings (`scroll`, `animations`, `transitions`,
`page-transitions`) so the tier-parent folder itself is still earning its keep; only the
`motion/motion` leaf reads oddly. Revisit whether the orchestrator layer should be renamed, or the
whole tier reshaped, in a future pass — not folded into this one.

`ui` (formerly Tier 1) and `baseline` (formerly Tier 7) no longer exist as layers — `ui` was
dissolved (its 4 stack primitives moved into `layout`, `Container` renamed `AppContainer` and
moved into `core`), and `baseline` was merged into `scripts` (it wrapped a third-party embed, the
same shape as `scripts`' other embed facades). `theme` was renamed `theming`. `starter` was
relocated out of `layers/` into `apps/` — it's a demo app, not a layer. `element` (formerly Tier 1)
was folded into `core` — it had no layer deps of its own beyond `core`, no other layer depended on
it, and every layer benefits from the primitive being always-present rather than opt-in; `core`
now ships both `Element` (inline-`:style`) and `ElementTw` (Tailwind arbitrary-property classes,
same props, same underlying style composables).

**Open item, not yet decided:** the tier design's summary table describes `transitions` as
absorbing `page-transitions`, but that merge was never implemented — both still exist as separate,
real layers with real content. Treat them as distinct Tier 5 members until that merge is either
done or dropped; don't assume the absorption already happened.

## Layer Dependency Graph

```
# Tier 0 — Foundation
core → (nothing)

# Tier 1 — Design System
theming → core
typography → core
visual → core

# Tier 2 — Structure
layout → core
navigation → core, scroll, layout, typography
routing → core

# Tier 3 — Content
content → core

# Tier 4 — Data
database → core
auth → core
metadata → core
data/metadata/providers/comicvine → metadata
data/metadata/providers/openlibrary → metadata
data/metadata/providers/google-books → metadata
data/metadata/providers/themoviedb → metadata
mailer → core
forms → mailer

# Tier 5 — Motion
scroll → core
animations → scroll
transitions → core
page-transitions → core
motion → scroll, animations, transitions, page-transitions

# Tier 6 — Render
canvas → core
shader → canvas

# Tier 7 — Delivery
seo → core
scripts → core
feeds → core, content
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

## Orchestration workflow

You (Fable) are the orchestrator. Plan, decompose, synthesize.
Reasoning-heavy phases → deep-reasoner
Mechanical work → fast-worker
Codex (/codex:rescue --background) is a cracked engineer on par with deep-reasoner, from a different perspective. Treat as a peer, not a reviewer.
High-stakes decisions: task Opus + Codex on the same problem in parallel, synthesize the best of both, without showing either the other's answer. Keep your own context lean.
