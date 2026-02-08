# Usage Guide

How to consume `kmcom-nuxt-layers` in your Nuxt 4 project.

## Installation

```bash
npm install kmcom-nuxt-layers
```

## Basic Usage

Add layers to the `extends` array in your `nuxt.config.ts`. Each layer is referenced by its filesystem path within the package:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/ui',
  ]
})
```

Nuxt resolves each layer via the `package.json` → `"main": "./nuxt.config.ts"` entry. No import maps or special configuration needed.

## Available Layers

| Layer | Extends Path | Depends On | Required Dependencies |
|-------|-------------|------------|----------------------|
| **core** | `kmcom-nuxt-layers/layers/core` | — | `nuxt`, `@nuxt/ui`, `pinia`, `@vueuse/nuxt`, `@nuxtjs/device` |
| **ui** | `kmcom-nuxt-layers/layers/ui` | core | — |
| **layout** | `kmcom-nuxt-layers/layers/layout` | core | — |
| **motion** | `kmcom-nuxt-layers/layers/motion` | core | `gsap`, `locomotive-scroll` |
| **shader** | `kmcom-nuxt-layers/layers/shader` | core | `three`, `@tresjs/nuxt`, `@tresjs/core`, `@tresjs/cientos`, `@tresjs/post-processing` |
| **forms** | `kmcom-nuxt-layers/layers/forms` | core | `zod` |
| **theme** | `kmcom-nuxt-layers/layers/theme` | core | — |
| **content** | `kmcom-nuxt-layers/layers/content` | core | `@nuxt/content`, `better-sqlite3` |

## Layer Dependency Rules

1. **Always include `core` first** — all other layers depend on it
2. **Order matters** — list `core` before any layer that depends on it
3. **Only include what you need** — each layer is independent (apart from the core dependency)

## Layer-Specific Dependencies

Install additional dependencies only for the layers you use:

```bash
# Motion layer
npm install gsap locomotive-scroll

# Shader layer
npm install three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing

# Forms layer
npm install zod

# Content layer
npm install @nuxt/content better-sqlite3
```

## Configuration Examples

### Core + UI (design system)

```ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/ui',
  ]
})
```

### Core + UI + Layout (full page structure)

```ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/ui',
    'kmcom-nuxt-layers/layers/layout',
  ]
})
```

### Core + Motion (animations)

```bash
npm install gsap locomotive-scroll
```

```ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/motion',
  ]
})
```

### Full Stack

```bash
npm install gsap locomotive-scroll three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing zod @nuxt/content better-sqlite3
```

```ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/ui',
    'kmcom-nuxt-layers/layers/layout',
    'kmcom-nuxt-layers/layers/motion',
    'kmcom-nuxt-layers/layers/shader',
    'kmcom-nuxt-layers/layers/forms',
    'kmcom-nuxt-layers/layers/theme',
    'kmcom-nuxt-layers/layers/content',
  ]
})
```

## Overriding Layer Config

Each layer provides typed runtime defaults via `app.config.ts`. Override any value in your own `app.config.ts`:

```ts
// app.config.ts
export default defineAppConfig({
  // Core layer overrides
  coreLayer: {
    loading: {
      enabled: false,          // Disable loading screen
    },
    scrollGuard: {
      enabled: false,          // Disable scroll guard
    },
  },

  // Motion layer overrides
  motion: {
    lenis: {
      duration: 0.8,           // Faster smooth scroll
      smoothTouch: true,       // Enable on touch devices
    },
  },

  // Theme layer overrides
  themeLayer: {
    defaultAccent: 'indigo',   // Change default accent color
    accents: ['blue', 'indigo', 'violet', 'purple'],  // Limit palette
  },
})
```

### Available Config Namespaces

| Namespace | Layer | Key Options |
|-----------|-------|-------------|
| `coreLayer.loading` | core | `enabled`, `minDuration`, `maxDuration`, `background`, `textColor` |
| `coreLayer.scrollGuard` | core | `enabled`, `strict`, `excludeSelectors`, `debug` |
| `coreLayer.errors` | core | `logToConsole`, `logToExternal`, `externalUrl` |
| `coreLayer.notFound` | core | `icon`, `title`, `description`, `showHomeButton`, `actions`, `suggestions` |
| `motion` | motion | `gsapScrollTrigger`, `lenis.*` (duration, smoothWheel, smoothTouch, etc.) |
| `themeLayer` | theme | `accents`, `defaultAccent` |

## Optional Modules

Some modules used in the layers are optional or dev-only:

- **`@nuxt/eslint`** — Loaded only in development (`NODE_ENV !== 'production'`). Install if you want layer-provided ESLint config during dev.
- **`@vite-pwa/nuxt`** — Loaded only in production by the core layer. Install if you want PWA support.
- **`nuxt-studio`** — Optional peer dependency of the content layer. Install for Nuxt Studio CMS integration.
