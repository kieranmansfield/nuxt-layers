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
│   ├── components/      # Auto-imported Vue components
│   ├── composables/     # Auto-imported composables
│   └── types/           # TypeScript types (not auto-imported)
├── server/
│   ├── api/             # Nitro API routes (auto-registered)
│   └── utils/           # Nitro server utilities (auto-imported in server/)
├── app.config.ts        # App config defaults + declare module augmentation
├── nuxt.config.ts       # Layer config: alias, runtimeConfig, modules, etc.
└── package.json
```

## All Layers

| Layer | Purpose | Depends on |
|-------|---------|------------|
| `core` | Base utilities, 404, loading screen, scroll guard | nothing (loads @nuxt/ui, @vueuse/nuxt, @nuxtjs/device) |
| `ui` | Shared UI component library | `core` |
| `layout` | Page layout components (header, footer, sidebar) | `core` |
| `motion` | Animation and motion composables/directives | `core` |
| `shader` | GLSL shader components (Three.js / TresJS) | `core` |
| `forms` | Form components, validation, email sending | `core` |
| `theme` | Design tokens and theming utilities | `core` |
| `content` | Nuxt Content v3 collections and components | `core` |

## Alias Pattern

Each layer registers its own `#layers/<name>` alias pointing to its root directory:

```ts
// layers/<name>/nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    '#layers/<name>': import.meta.dirname,
  },
})
```

Import example: `import { formsLayerHooks } from '#layers/forms/server/utils/hooks'`

## Dependency Graph

- `core` has **no** layer dependencies — it is always loaded first
- All other layers depend on `core` and should be listed after it in `PLAYGROUND_LAYERS`
- Layers should **not** depend on each other (except `core`) to avoid circular deps

## Server Code

Layers can include Nitro server extensions. Files are auto-registered by Nuxt:

- `server/api/*.ts` — Nitro API routes (`defineEventHandler`, `readBody`, `createError` auto-imported)
- `server/utils/*.ts` — Server utilities (auto-imported within other server files)
- `server/plugins/*.ts` — Nitro plugins (`defineNitroPlugin` auto-imported)

`useRuntimeConfig()` is available as an auto-import in all server utilities and API routes.

## App Config Augmentation

Each layer that adds `app.config.ts` defaults must also augment the `@nuxt/schema` types in the
same file:

```ts
// layers/<name>/app.config.ts
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
