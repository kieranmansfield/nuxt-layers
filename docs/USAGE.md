# Usage Guide

How to consume `kmcom-nuxt-layers` in your Nuxt 4 project.

## Installation

```bash
npm install kmcom-nuxt-layers
```

## Basic Usage

Add layers to the `extends` array in your `nuxt.config.ts`. Each layer is an entry in the package `exports` map:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['kmcom-nuxt-layers/layers/core', 'kmcom-nuxt-layers/layers/typography'],
})
```

Every non-core layer declares its own `extends`, so you only list what you want. A misspelled or
removed layer name is **not** an error: Nuxt only warns `Cannot extend config from ...` and the
layer is silently skipped. Check the dev log for that warning after changing `extends`.

## Requirements

- `nuxt >= 4.6.1` (older 4.x resolves a mismatched `@nuxt/schema` and breaks Nitro config types).
- `typescript.strict: true`. The layers' sources are pulled into your `vue-tsc` graph and are
  written for strict mode.
- If `@nuxtjs/seo` is enabled, pin `unhead` to a single version (pnpm `overrides`) so Nitro's
  file trace includes `unhead/dist/legacy.mjs`.

### Expected warning: `NUXT_B5023`

On `nuxt dev`, `build` and `prepare` you will see one warning per layer:

```
WARN [NUXT_B5023] The config file .../layers/core/nuxt.config.ts was loaded through jiti
because the runtime could not load it: Stripping types is currently unsupported for files
under node_modules
```

This is expected and harmless. The layers ship `.ts` configs, Node refuses to strip types under
`node_modules`, and Nuxt falls back to jiti. Nothing is broken; startup is slightly slower.

## Available Layers

| Layer                | Extends Path                                | Depends On                           |
| -------------------- | ------------------------------------------- | ------------------------------------ |
| **core**             | `kmcom-nuxt-layers/layers/core`             | —                                    |
| **theming**          | `kmcom-nuxt-layers/layers/theming`          | core                                 |
| **typography**       | `kmcom-nuxt-layers/layers/typography`       | core                                 |
| **visual**           | `kmcom-nuxt-layers/layers/visual`           | core                                 |
| **layout**           | `kmcom-nuxt-layers/layers/layout`           | core                                 |
| **navigation**       | `kmcom-nuxt-layers/layers/navigation`       | core, scroll, layout, typography     |
| **routing**          | `kmcom-nuxt-layers/layers/routing`          | core                                 |
| **content**          | `kmcom-nuxt-layers/layers/content`          | core                                 |
| **database**         | `kmcom-nuxt-layers/layers/database`         | core                                 |
| **auth**             | `kmcom-nuxt-layers/layers/auth`             | core                                 |
| **metadata**         | `kmcom-nuxt-layers/layers/metadata`         | core                                 |
| **mailer**           | `kmcom-nuxt-layers/layers/mailer`           | core                                 |
| **forms**            | `kmcom-nuxt-layers/layers/forms`            | mailer                               |
| **scroll**           | `kmcom-nuxt-layers/layers/scroll`           | core                                 |
| **animations**       | `kmcom-nuxt-layers/layers/animations`       | scroll                               |
| **transitions**      | `kmcom-nuxt-layers/layers/transitions`      | core                                 |
| **page-transitions** | `kmcom-nuxt-layers/layers/page-transitions` | core                                 |
| **motion**           | `kmcom-nuxt-layers/layers/motion`           | scroll, animations, transitions, ... |
| **canvas**           | `kmcom-nuxt-layers/layers/canvas`           | core                                 |
| **shader**           | `kmcom-nuxt-layers/layers/shader`           | canvas                               |
| **seo**              | `kmcom-nuxt-layers/layers/seo`              | core                                 |
| **scripts**          | `kmcom-nuxt-layers/layers/scripts`          | core                                 |
| **feeds**            | `kmcom-nuxt-layers/layers/feeds`            | core, content                        |

Metadata providers: `kmcom-nuxt-layers/layers/metadata/providers/{comicvine,openlibrary,google-books,themoviedb}`.

### Upgrading from v2

| v2        | v5                                        |
| --------- | ----------------------------------------- |
| `ui`      | `typography` + `navigation` + `visual`    |
| `theme`   | `theming`                                 |
| `starter` | removed (now `apps/starter`, not a layer) |

## Layer-Specific Dependencies

Install additional dependencies only for the layers you use:

```bash
# motion / animations / scroll
npm install gsap locomotive-scroll

# canvas / shader
npm install three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing

# forms
npm install zod

# content
npm install @nuxt/content better-sqlite3

# scripts (baseline-status badge)
npm install @nuxt/scripts baseline-status
```

## Content layer contract

The `Blog`, `Portfolio` and `Gallery` components and the `useBlogPosts` / `useGalleryItems`
composables are typed against collections named `blog`, `portfolio` and `gallery`. Define them in
your app's `content.config.ts` (empty collections are fine):

```ts
export default defineContentConfig({
  collections: {
    content: defineCollection({ type: 'page', source: '**/*.md' }),
    blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
    portfolio: defineCollection({ type: 'page', source: 'portfolio/**/*.md' }),
    gallery: defineCollection({ type: 'page', source: 'gallery/**/*.md' }),
  },
})
```

Do not pass `schema:` to `defineCollection`; the layer's `collections.d.ts` augments the item types.

## Configuration Examples

### Design system

```ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/theming',
    'kmcom-nuxt-layers/layers/typography',
    'kmcom-nuxt-layers/layers/visual',
  ],
})
```

### Page structure + navigation

```ts
export default defineNuxtConfig({
  extends: ['kmcom-nuxt-layers/layers/core', 'kmcom-nuxt-layers/layers/navigation'],
})
```

### Motion

```ts
export default defineNuxtConfig({
  extends: ['kmcom-nuxt-layers/layers/core', 'kmcom-nuxt-layers/layers/motion'],
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
      enabled: false, // Disable loading screen
    },
    scrollGuard: {
      enabled: false, // Disable scroll guard
    },
  },

  // Motion layer overrides
  motion: {
    lenis: {
      duration: 0.8, // Faster smooth scroll
      smoothTouch: true, // Enable on touch devices
    },
  },

  // Theming layer overrides
  themeLayer: {
    defaultAccent: 'indigo', // Change default accent color
    accents: ['blue', 'indigo', 'violet', 'purple'], // Limit palette
  },
})
```

### Available Config Namespaces

| Namespace               | Layer   | Key Options                                                                |
| ----------------------- | ------- | -------------------------------------------------------------------------- |
| `coreLayer.loading`     | core    | `enabled`, `minDuration`, `maxDuration`, `background`, `textColor`         |
| `coreLayer.scrollGuard` | core    | `enabled`, `strict`, `excludeSelectors`, `debug`                           |
| `coreLayer.errors`      | core    | `logToConsole`, `logToExternal`, `externalUrl`                             |
| `coreLayer.notFound`    | core    | `icon`, `title`, `description`, `showHomeButton`, `actions`, `suggestions` |
| `motion`                | motion  | `gsapScrollTrigger`, `lenis.*` (duration, smoothWheel, smoothTouch, etc.)  |
| `themeLayer`            | theming | `accents`, `defaultAccent`                                                 |

## Optional Modules

Some modules used in the layers are optional or dev-only:

- **`@nuxt/eslint`** — Loaded only in development (`NODE_ENV !== 'production'`). Install if you want layer-provided ESLint config during dev.
- **`@vite-pwa/nuxt`** — Currently disabled in the core layer (commented out). Add it to your own `modules` if you want PWA support; the layer does not type the `pwa` config key for you.
- **`nuxt-studio`** — Optional peer dependency of the content layer. Install for Nuxt Studio CMS integration.
