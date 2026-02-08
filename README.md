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
    'kmcom-nuxt-layers/layers/ui',
    // add more layers as needed
  ]
})
```

## Layers

| Layer | Description |
|-------|-------------|
| **core** | Foundation — Nuxt UI, VueUse, Pinia, loading screen, error handling, scroll guard |
| **ui** | Design system — typography, color, media, branding components |
| **layout** | Page structure — grids, containers, spacing |
| **motion** | Animations — GSAP, Locomotive Scroll |
| **shader** | 3D / WebGPU — Three.js, TresJS |
| **forms** | Validation — Zod-based form system |
| **theme** | Theming — color mode, accent colors |
| **content** | CMS — @nuxt/content, Nuxt Studio |

All layers depend on `core`. Always list `core` first in `extends`.

## Documentation

- **[Usage Guide](docs/USAGE.md)** — installation, configuration examples, layer dependencies
- **[Architecture](docs/ARCHITECTURE.md)** — internal structure, alias system, dev workflow

## License

ISC
