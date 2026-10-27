# Content Layer

Nuxt Content v3 collections and components (blog, portfolio, gallery, pages).

## Consumer apps must define their own collections

`@nuxt/content` loads `content.config.ts` from every layer and merges collections by name, but a
collection's `source` is rooted at the layer that defined it (`collection.__rootDir`). This layer's
collections therefore look in `layers/content/content/**`, which is empty. Only a collection
declared in the app itself reads the app's `content/` folder. The app's `content.config.ts` is not
duplication — it is required (see `docs/adr/0002-content-config-is-app-owned.md`).

Copy this into the app's `content.config.ts`:

```ts
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({ type: 'page', source: 'pages/**/*.md' }),
    blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
    portfolio: defineCollection({ type: 'page', source: 'portfolio/**/*.md' }),
    gallery: defineCollection({ type: 'page', source: 'gallery/**/*.md' }),
  },
})
```

**Never pass `schema:` to `defineCollection`.** c12 loads each config through jiti with
`moduleCache: false`, so zod validators are never initialized and the call throws. The schema
objects exported from this layer's `content.config.ts` exist for type inference only;
`app/types/collections.d.ts` types the frontmatter and must be kept in sync with them.

## Nuxt Studio

`nuxt-studio` is an optional peer dependency. This layer adds it to `modules` whenever the app has
it installed, in dev and production alike, so the app doesn't need to list it (listing it as well is
harmless: Nuxt installs a module once per name).

- **Dev (`nuxt dev`)**: Studio opens on every page with no login and writes straight to the app's
  `content/` and `public/` folders.
- **Production**: needs a server (`nuxt build`, not `nuxt generate`) for the OAuth callback at
  `/__nuxt_studio/auth/github`. The app sets `studio.repository` (owner/repo/branch, plus `rootDir`
  if the app isn't at the repo root) and supplies `STUDIO_GITHUB_CLIENT_ID` /
  `STUDIO_GITHUB_CLIENT_SECRET` at runtime. Logging in is `Cmd/Ctrl + .` or visiting `/_studio`.
- **Opting out of production editing**: set `$production: { studio: false }` in the app's
  `nuxt.config.ts` — Nuxt skips any module whose config key is `false`. The playground does this.

Studio builds its frontmatter forms from each collection's schema; a collection without one is
edited as raw YAML. That interacts with the `schema:` caveat above.
