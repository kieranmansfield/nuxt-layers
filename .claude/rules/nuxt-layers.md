---
paths:
  - "layers/**/*"
---

# Nuxt Layers Development

## Layer Structure

Each layer is an independent package that extends Nuxt apps. Nuxt 4 uses the `app/` directory
convention inside each layer:

```
layers/<name>/
├── app/
│   ├── app.config.ts    # App config defaults + declare module augmentation ← MUST be here
│   ├── components/      # Auto-imported Vue components
│   ├── composables/     # Auto-imported composables
│   └── types/           # TypeScript types (not auto-imported)
├── server/
│   ├── api/             # Nitro API routes (auto-registered)
│   └── utils/           # Nitro server utilities (auto-imported in server/)
├── nuxt.config.ts       # Layer config: alias, runtimeConfig, modules, etc.
└── package.json
```

**IMPORTANT**: `app.config.ts` belongs inside `app/`, NOT at the layer root.
Nuxt 4 resolves `app.config.ts` from `srcDir` (the `app/` directory), not from the layer root.
Placing it at the layer root silently ignores it — `useAppConfig()` returns `undefined` for that namespace.

## All Layers

| Layer | Purpose | Depends on |
|-------|---------|------------|
| `core` | Base utilities, 404, loading screen, scroll guard | nothing (loads @nuxt/ui, @vueuse/nuxt, @nuxtjs/device) |
| `seo` | SEO: robots, sitemap, og-image, schema-org via @nuxtjs/seo | `core` |
| `scripts` | Third-party script loading via @nuxt/scripts (analytics, GTM, embeds) | `core` |
| `typography` | Typography components (Headline, TextStroke, CodeBlock) + useTypography, useColor | `core` |
| `navigation` | Nav/header/footer, site title, links, useMastNav, useSite, useAppToast | `core`, `scroll`, `layout`, `typography` |
| `visual` | Accent blobs, gradients, tints, modals, picture, progress + their composables | `core` |
| `ui` | UI orchestrator — composes typography, navigation, visual + default layout | `typography`, `navigation`, `visual` |
| `layout` | Page layout components (header, footer, sidebar) | `core` |
| `scroll` | GSAP + Locomotive Scroll infrastructure, scroll-reactive components | `core` |
| `animations` | Animation components (Marquee, Cursor, Tilt, Magnetic, CountUp, TextReveal) | `scroll` |
| `transitions` | CSS transition/animation classes + Transition.vue component | `core` |
| `page-transitions` | Nuxt page transition defaults + usePageTransition() | `core` |
| `motion` | Motion orchestrator — composes scroll, animations, transitions, page-transitions | `scroll`, `animations`, `transitions`, `page-transitions` |
| `canvas` | WebGL/WebGPU/TresJS rendering context | `core` |
| `shader` | TSL shader pipeline blocks, materials, presets | `canvas` |
| `mailer` | Email sending via Resend, hooks, runtime config | `core` |
| `forms` | Form UI components, Zod validation | `mailer` |
| `database` | Drizzle ORM + Neon Postgres connection; useSql(), useDrizzle(schema) server utils | `core` |
| `theme` | Design tokens and theming utilities | `core` |
| `content` | Nuxt Content v3 collections and components | `core` |
| `routing` | Advanced routing, maintenance mode, feature flags | `core` |

## Alias Pattern

Each layer registers `#layers/<name>` (root) and `#layers/<name>/types` (types directory):

```ts
// layers/<name>/nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    '#layers/<name>': import.meta.dirname,
    '#layers/<name>/types': `${import.meta.dirname}/app/types`,
  },
})
```

Import examples:
- `import { formsLayerHooks } from '#layers/forms/server/utils/hooks'`
- `import type { GridConfig } from '#layers/layout/types/layouts'`

## Dependency Graph

- `core` has **no** layer dependencies — it is always the base
- **Every non-core layer MUST declare `extends: ['../core']` in its own `nuxt.config.ts`**
- Do not rely on the playground load order to provide core — declare the dependency explicitly
- Layers may depend on other layers to form a chain (e.g. `animations → scroll → core`); avoid circular deps
- Nuxt deduplicates layers when multiple paths resolve to the same config, so there is no cost
  to declaring `extends: ['../core']` even when the playground already loads core first

## Server Code

Layers can include Nitro server extensions. Files are auto-registered by Nuxt:

- `server/api/*.ts` — Nitro API routes (`defineEventHandler`, `readBody`, `createError` auto-imported)
- `server/utils/*.ts` — Server utilities (auto-imported within other server files)
- `server/plugins/*.ts` — Nitro plugins (`defineNitroPlugin` auto-imported)

`useRuntimeConfig()` is available as an auto-import in all server utilities and API routes.

## App Config Augmentation

Each layer that adds `app.config.ts` defaults must also augment the `@nuxt/schema` types in the
same file. The file MUST be at `layers/<name>/app/app.config.ts` (inside `srcDir`):

```ts
// layers/<name>/app/app.config.ts
export default defineAppConfig({ myLayer: { ... } })

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: { ... }
  }
}
```

**Do not add a second `declare module` block in the same file** — one block per file is sufficient.

## Runtime Config Augmentation

For private server config (e.g. API keys), add `runtimeConfig` to `nuxt.config.ts` and augment
`@nuxt/schema` types in the same file:

```ts
// layers/<name>/nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    myLayer: { apiKey: '' },
  },
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    myLayer?: { apiKey: string }
  }
}
```

## Best Practices

- Layers must be self-contained and composable — no implicit cross-layer imports
- Test all changes against the playground app (`PLAYGROUND_LAYERS=core,<name> pnpm dev`)
- Keep `app.config.ts` declarations and defaults in sync
- Server utilities should read `runtimeConfig` at call time, not at module init
