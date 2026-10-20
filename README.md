# kmcom-nuxt-layers

Composable Nuxt 4 layers for building scalable Vue applications. Pick only the layers you need.

## Quick Start

```bash
npm install kmcom-nuxt-layers
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core',
    'kmcom-nuxt-layers/layers/typography',
    // add more layers as needed
  ]
})
```

## Layers

| Layer | Description |
|-------|-------------|
| **core** | Foundation — Nuxt UI, VueUse, Pinia, loading screen, error handling, Element primitives |
| **theming** / **typography** / **visual** | Design system — accents, type, gradients, modals |
| **layout** / **navigation** / **routing** | Structure — grids, stacks, nav components, feature flags |
| **content** | CMS — @nuxt/content, Nuxt Studio |
| **database** / **auth** / **metadata** / **mailer** / **forms** | Data — Drizzle + Neon, GitHub OAuth, metadata providers, Resend, Zod forms |
| **scroll** / **animations** / **transitions** / **page-transitions** / **motion** | Motion — GSAP, Locomotive Scroll |
| **canvas** / **shader** | Render — TresJS, WebGPU/TSL |
| **seo** / **scripts** / **feeds** | Delivery — @nuxtjs/seo, @nuxt/scripts, RSS/Atom/JSON feeds |

Upgrading from v2: `ui` → `typography` + `navigation` + `visual`, `theme` → `theming`, `starter` removed.

All layers depend on `core`. Always list `core` first in `extends`.

## Documentation

- **[Usage Guide](docs/USAGE.md)** — installation, configuration examples, layer dependencies
- **[Architecture](docs/ARCHITECTURE.md)** — internal structure, alias system, dev workflow

## License

ISC
