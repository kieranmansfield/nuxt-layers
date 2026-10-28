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

## GitHub and Obsidian stats on portfolio items

Portfolio frontmatter takes `github: owner/name` (or a github.com URL) and `obsidian: <plugin-id>`;
`PortfolioDetail` renders a `ProjectStatsGithubCard` / `ProjectStatsObsidianCard` for each from
the `project-stats` layer (which this layer extends). Set `NUXT_PROJECT_STATS_LAYER_GITHUB_TOKEN`
in production — unauthenticated GitHub calls are capped at 60/hour per server IP.

**Never pass `schema:` to `defineCollection`.** c12 loads each config through jiti with
`moduleCache: false`, so zod validators are never initialized and the call throws. The schema
objects exported from this layer's `content.config.ts` exist for type inference only;
`app/types/collections.d.ts` types the frontmatter and must be kept in sync with them.

Without a schema, Nuxt Content files every non-standard frontmatter field (`date`, `tags`, `image`,
`colors`, `stack`, …) under `item.meta`. The fetching composables (`useCollectionItem`,
`useCollectionItems`, `useContentPage`) lift it back onto the item with `hoistFrontmatter`, which
is what makes the top-level types true — query through them, not `queryCollection` directly.
Nothing validates frontmatter either, so components should tolerate loose shapes (e.g.
`weights: 400` instead of a list).

## Portfolio stack cards

`stack` frontmatter on a portfolio item renders `PortfolioStackGrid` in `PortfolioDetail`. Entries
are a bare name or `{ name, icon?, color?, url? }`; `resolveStackItem` (`app/utils/portfolioStack.ts`)
fills `icon`/`color` for common tech from its built-in table (Iconify `logos` set, shipped as
`@iconify-json/logos` so icons resolve without the Iconify API) and falls back to a generic icon.

The grid places cards with `LayoutGridItem` on the same 6/12/18-column tracks as layout's Swiss
grid; `fanPlacement` decides each card's columns, row, rotation and drop per breakpoint. Motion is
the reason this layer extends `animations`: `useMagneticElement` and `useTiltEffect` drive each
card, and `useGsap` deals the deck in on scroll. All of it is skipped under reduced motion.
