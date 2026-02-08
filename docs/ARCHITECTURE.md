# Architecture

Internal documentation for the `kmcom-nuxt-layers` monorepo.

## Monorepo Structure

```
nuxt-layers/
├── apps/
│   └── playground/          # Demo / development Nuxt app
├── layers/
│   ├── core/                # Base utilities, plugins, error handling
│   ├── ui/                  # Typography, color, media primitives
│   ├── layout/              # Grid, containers, page structure
│   ├── motion/              # GSAP + Locomotive Scroll animations
│   ├── shader/              # Three.js / TresJS WebGPU shaders
│   ├── forms/               # Zod-based form validation
│   ├── theme/               # Color mode, accent colors, accessibility
│   └── content/             # @nuxt/content integration, Nuxt Studio
├── packages/                # Shared utilities (placeholder)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Tooling:** pnpm workspaces for dependency management, Turbo for parallel task orchestration (`build`, `dev`, `lint`, `typecheck`).

## Layer Pattern

Each layer under `layers/` is an independent Nuxt-extendable package. A layer's `package.json` declares `"main": "./nuxt.config.ts"`, making it resolvable by Nuxt's `extends` mechanism.

Typical layer directory structure:

```
layers/<name>/
├── nuxt.config.ts           # Layer config (alias, modules, css, plugins)
├── app.config.ts            # Typed runtime config with defaults
├── package.json             # name, main, dependencies
├── app/
│   ├── assets/css/main.css  # Layer-specific CSS
│   ├── components/          # Auto-imported Vue components
│   ├── composables/         # Auto-imported composables
│   ├── plugins/             # Nuxt plugins
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── .playground/             # Isolated dev/test app for this layer
```

## Alias System

Each layer registers a `#layers/<name>` alias pointing to its own root directory via `import.meta.dirname`:

```ts
// layers/core/nuxt.config.ts
alias: {
  '#layers/core': import.meta.dirname,
}
```

This allows layers to reference their own files with stable paths that resolve correctly both in the monorepo and when consumed from `node_modules`:

```ts
css: ['#layers/core/app/assets/css/main.css'],
plugins: ['#layers/core/app/plugins/init.ts'],
```

## Layer Dependency Graph

```
core  (foundation — no dependencies)
  ├── ui         (typography, color, media)
  ├── layout     (grid, containers)
  ├── motion     (GSAP, Locomotive Scroll)
  ├── shader     (Three.js, TresJS)
  ├── forms      (Zod validation)
  ├── theme      (color mode, accents)
  └── content    (@nuxt/content, Nuxt Studio)
```

All layers depend on `core`. The `core` layer must always be listed first in `extends`.

## Playground Composition System

The `apps/playground/nuxt.config.ts` supports selective layer loading via the `PLAYGROUND_LAYERS` environment variable.

```bash
# Load only core + ui
PLAYGROUND_LAYERS=core,ui pnpm -F playground dev

# Load all layers (default when env var is unset)
pnpm dev
```

The `resolveExtendedLayers()` function:
1. Parses `PLAYGROUND_LAYERS` as a comma-separated list
2. Auto-includes each layer's dependencies (defined in `LAYER_DEPENDENCIES`)
3. Returns paths in correct order (dependencies first, following `AVAILABLE_LAYERS` order)

## CSS Cascade

Each layer loads its own CSS via the `css` array in `nuxt.config.ts`:

```ts
css: ['#layers/<name>/app/assets/css/main.css']
```

- **core** imports Tailwind CSS 4 and Nuxt UI base styles
- **theme** uses a separate `theme.css` file for color mode variables
- Layer CSS is loaded in `extends` order, so core styles are always available to downstream layers

## Component Auto-Import

Nuxt auto-discovers components from all extended layers' `app/components/` directories. No manual registration needed.

The shader layer uses explicit component registration with `global: true` for its WebGPU components:

```ts
components: [{
  path: './app/components',
  pathPrefix: false,
  global: true,
}]
```

## app.config.ts

Each layer provides typed runtime configuration via `app.config.ts` with sensible defaults. Consumers can override any value in their own `app.config.ts`.

Key config namespaces:
- `coreLayer` — loading screen, error handling, scroll guard, 404 page
- `motion` — Lenis smooth scroll, GSAP ScrollTrigger integration
- `themeLayer` — accent colors, default accent

Type augmentation is done via `declare module '@nuxt/schema'` in each layer's `app.config.ts`.

## Git Subtree Management

Layers are managed as git subtrees from separate upstream repositories:

```bash
# Push layer changes to upstream
git subtree push --prefix=layers/<layer> <remote-url> main

# Pull updates from upstream
git subtree pull --prefix=layers/<layer> <remote-url> main --squash
```

Always commit changes to the monorepo first, then push to upstream if needed.

## Dev Workflow

```bash
# Start all layers via playground
pnpm dev

# Start specific layer combinations
pnpm dev:core          # core only
pnpm dev:ui            # core + ui
pnpm dev:layout        # core + ui + layout
pnpm dev:motion        # core + motion

# Build / lint / typecheck (all packages via Turbo)
pnpm build
pnpm lint
pnpm typecheck

# Layer-specific tasks
pnpm layer:core        # turbo dev for core
pnpm build:core        # turbo build for core

# Clean everything
pnpm clean
```

## .playground Directories

Each layer has a `.playground/` directory containing a minimal Nuxt app for isolated development and testing of that layer. These are used by the `dev` script in each layer's `package.json`:

```bash
cd layers/core && pnpm dev   # runs nuxi dev .playground
```

Some layers (ui, content) support standalone mode via environment variables (`UI_STANDALONE`, `CONTENT_STANDALONE`) which auto-extends core when running outside the monorepo playground.

## Layer Details

| Layer | Description |
|-------|-------------|
| **core** | Foundation layer. Nuxt UI, VueUse, device detection, Pinia, loading screen, error handler, scroll guard, feature detection, PWA support (production only). |
| **ui** | Design system primitives. Typography components (Headline, CodeBlock, QuoteBlock), color system, media/picture component, site branding, breakpoint types. |
| **layout** | Page structure. Grid systems, containers, spacing, layout compositions with breakpoint-based responsiveness. |
| **motion** | Animation layer. GSAP with ScrollTrigger, Locomotive Scroll (Lenis) smooth scrolling, motion composables. Transpiles GSAP for SSR. |
| **shader** | WebGPU/WebGL layer. Three.js + TresJS integration, TSL shader support, post-processing. Includes custom shader utilities and auto-imported shader modules. |
| **forms** | Form validation layer. Zod schema-based validation, form composables, typed form components. |
| **theme** | Theming layer. Color mode switching, accent color palette, theme plugin, CSS custom properties for dynamic theming. |
| **content** | Content management layer. @nuxt/content integration, better-sqlite3 for local content DB, optional Nuxt Studio support. |
