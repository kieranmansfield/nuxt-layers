# Migration Guide: Feeds Layer, Site Config & Content Type Normalisation

Four related changes landed together. None are strictly breaking for existing pages, but anything that reads `feedsLayer.site`, imports `SiteAuthor`, or uses the `authors[].url` frontmatter field needs updating.

---

## 1. Shared `site` config (replaces `feedsLayer.site`)

Site metadata is no longer namespaced under `feedsLayer`. It lives at the top-level `site` key in `app.config.ts`, owned by the core layer's type declarations. Any layer can read it.

**Before:**
```ts
// app/app.config.ts
export default defineAppConfig({
  feedsLayer: {
    site: {
      title: 'My Site',
      url: 'https://example.com',
      author: { name: 'Jane', email: 'jane@example.com' },
    },
  },
})
```

**After:**
```ts
// app/app.config.ts
export default defineAppConfig({
  site: {
    title: 'My Site',
    url: 'https://example.com',
    author: { name: 'Jane', email: 'jane@example.com' },
  },
})
```

The `site` key is typed via `SiteConfig` from the core layer — `useAppConfig().site` has full TypeScript completion.

---

## 2. `SiteAuthor` renamed to `Author`

The core type previously exported as `SiteAuthor` is now exported as `Author`. It's the base author shape used by `SiteConfig.author`, `ContentAuthor`, and any other layer that deals with authorship.

**Before:**
```ts
import type { SiteAuthor } from '#layers/core/app/types/site'

const author: SiteAuthor = { name: 'Jane' }
```

**After:**
```ts
import type { Author } from '#layers/core/app/types/site'

const author: Author = { name: 'Jane' }
```

`SiteConfig.author` still has the same shape — only the type name changed.

---

## 3. Content author `url` renamed to `link`

The `url` field on blog post authors has been renamed to `link` to align with core's `Author` type. The Zod schema, TypeScript interface, and markdown frontmatter all need updating.

**Zod schema (in your `content.config.ts`):**
```ts
// Before
authors: z.array(z.object({ name: z.string(), avatar: z.string().optional(), url: z.string().optional() }))

// After
authors: z.array(z.object({ name: z.string(), avatar: z.string().optional(), link: z.string().optional() }))
```

**Markdown frontmatter:**
```yaml
# Before
authors:
  - name: Jane Doe
    url: https://github.com/janedoe

# After
authors:
  - name: Jane Doe
    link: https://github.com/janedoe
```

**TypeScript interface** — `ContentAuthor` now extends `Author` instead of being a standalone type:
```ts
import type { Author } from '#layers/core/app/types/site'

// ContentAuthor from the content layer
interface ContentAuthor extends Author {
  avatar?: string
  // inherits: name, email?, link?
}
```

---

## 4. `BaseContent` base interface

A `BaseContent` interface was extracted from the shared fields across `BlogPost`, `PortfolioItem`, `GalleryItem`, and `ContentPage`. All four now extend it.

```ts
interface BaseContent {
  title: string
  description?: string
  image?: string
  tags?: string[]
  date?: string
  draft?: boolean
}
```

If you have custom types that replicate these fields, you can now extend `BaseContent` directly:

```ts
import type { BaseContent } from '#layers/content/app/types/content'

interface MyCustomPage extends BaseContent {
  featuredVideo?: string
}
```

---

## 5. Feeds layer: collection wiring

Feeds are now driven by `feedsLayer.feed.collections` — an array of collection names to expose as feeds. The default is `['blog']`. Add more collections to get automatic feed routes for each.

```ts
// app/app.config.ts
export default defineAppConfig({
  site: { ... },
  feedsLayer: {
    feed: {
      limit: 30,
      collections: ['blog'],           // expose these collections as feeds
      defaultCollection: 'blog',        // used by /feed/rss shorthand routes
    },
  },
})
```

Available feed URLs for each collection:

| URL | Format |
|-----|--------|
| `/feed/:collection/rss` | RSS 2.0 |
| `/feed/:collection/atom` | Atom 1.0 |
| `/feed/:collection/json` | JSON Feed 1.1 |
| `/feed/rss` | RSS for `defaultCollection` |
| `/feed/atom` | Atom for `defaultCollection` |
| `/feed/json` | JSON Feed for `defaultCollection` |
| `/feed` | JSON index of all configured feeds |

To expose portfolio items as a feed:
```ts
feedsLayer: {
  feed: { collections: ['blog', 'portfolio'] }
}
```

### Netlify / static deployment: prerender collection routes

Feed routes are server routes — they aren't discoverable by the prerender crawler. The feeds layer automatically prerenders the shorthand routes (`/feed`, `/feed/rss`, `/feed/atom`, `/feed/json`), but **collection-specific routes must be listed explicitly** in your app's `nuxt.config.ts`:

```ts
nitro: {
  prerender: {
    routes: [
      '/feed/blog/rss',
      '/feed/blog/atom',
      '/feed/blog/json',
      // one set per collection in feedsLayer.feed.collections
    ],
  },
},
```

Without this, collection routes return 404 on Netlify and other static hosts.

---

## 6. Feed autodiscovery in `<head>`

The feeds layer automatically injects `<link rel="alternate">` tags so RSS readers and browsers can discover feeds without cluttering every page with links for every collection.

**The rule:** every page gets the main site feeds. Pages that belong to a non-default collection also get that collection's specific feeds.

| Page | Links injected |
|------|---------------|
| `/`, `/about`, any non-collection page | 3 main site feeds |
| `/blog`, `/blog/hello-world` (if `blog` = `defaultCollection`) | 3 main site feeds (these already point to blog) |
| `/portfolio`, `/portfolio/project` (non-default collection) | 3 main site feeds + 3 portfolio feeds |

The main site feeds use the shorthand routes (`/feed/rss`, `/feed/atom`, `/feed/json`) which always serve `defaultCollection`. Collection-specific links are only added for non-default collections — where you're actively browsing content not covered by the main feeds.

No action required. The collection a page belongs to is inferred from the first path segment matching an entry in `feedsLayer.feed.collections`.

---

## Quick Reference

| Change | Action required |
|--------|----------------|
| Site metadata | Move `feedsLayer.site` → top-level `site` in `app.config.ts` |
| `SiteAuthor` type import | Rename to `Author` |
| Author `url` in frontmatter | Rename `url:` → `link:` in blog author blocks |
| Author `url` in Zod schema | Rename `url` → `link` in `authors` object schema |
| Collection feeds | Set `feedsLayer.feed.collections` in `app.config.ts` |
| Feed autodiscovery | Nothing — automatic via the feeds layer plugin |

---

# Migration Guide: v1.6.34 — Content Layer Collection Aliases & Section Disabling

Two new capabilities have been added to the content layer:

1. **Collection aliases** — reuse a collection schema under a custom name (e.g. `works` instead of `portfolio`)
2. **Section disabling** — suppress content routes you don't need via `app.config.ts`

Neither change is breaking. Existing apps using `portfolio`, `blog`, or `gallery` work exactly as before.

---

## 1. Collection Aliases

### The problem

The content layer hard-codes the collection names `blog`, `portfolio`, and `gallery`. If your app wants a `works` section that uses the portfolio schema, you previously had to duplicate the entire Zod schema in your own `content.config.ts`.

### The solution

The layer now exports named schemas and factory functions from `content.config.ts`:

```ts
// Named schema exports:
contentCollectionSchema
blogCollectionSchema
portfolioCollectionSchema
galleryCollectionSchema

// Factory functions (return a ready-to-use defineCollection(...) object):
createContentCollection(source?: string)
createBlogCollection(source?: string)
createPortfolioCollection(source?: string)
createGalleryCollection(source?: string)
```

Each factory defaults to the conventional source glob if you omit the argument.

### Registering a custom-named collection

In your app's `content.config.ts`, import the factory and register it under any name you like:

```ts
import { createPortfolioCollection, createBlogCollection } from '#layers/content/content.config'

export default defineContentConfig({
  collections: {
    blog: createBlogCollection(),
    works: createPortfolioCollection('works/**/*.md'),
    // gallery omitted — not needed
  }
})
```

Your markdown files now live at `content/works/`, and `queryCollection('works')` returns portfolio-shaped items.

### Querying the aliased collection

The layer also exports `createPortfolioComposables`, a factory that returns fully-wired `useItems` and `useItem` composables bound to your custom collection name:

```ts
// app/composables/useWorks.ts
import { createPortfolioComposables } from '#layers/content/app/composables/createPortfolioComposables'

const { useItems: useWorksItems, useItem: useWorksItem } = createPortfolioComposables('works')
export { useWorksItems, useWorksItem }
```

`useWorksItems` accepts the same options as `usePortfolioItems` (`featured`, `tags`, `limit`). `useWorksItem(slug)` fetches a single item by slug.

### Using Portfolio components with a custom collection

The `PortfolioList`, `PortfolioCard`, and `PortfolioDetail` components accept data via props — they don't query the collection directly. Pass your `works` data in to reuse them:

```vue
<PortfolioList :items="worksItems" />
<PortfolioDetail :item="worksItem" />
```

---

## 2. Section Disabling

### The problem

Layer pages at `/blog`, `/portfolio`, and `/gallery` are always registered. Previously there was no way to suppress a route you didn't want without creating a 404 override page in your app.

### The solution

All content routes now check `useAppConfig().contentLayer.sections` at runtime and throw a 404 if a section is explicitly set to `false`.

### Disabling sections

In your app's `app.config.ts` (must be inside `app/`):

```ts
export default defineAppConfig({
  contentLayer: {
    sections: {
      blog: true,
      portfolio: false,  // /portfolio and /portfolio/[slug] → 404
      gallery: false,    // /gallery and all nested routes → 404
    },
  },
})
```

All three flags default to `true` in the layer, so you only need to declare the ones you want to disable.

**Note:** The routes still exist at the Nuxt router level — they are compiled at build time from the layer's page files. Disabling returns a 404 response at runtime. Links to disabled routes will hit a 404 error page rather than being absent from the router.

---

## Quick Reference

| Goal | How |
|---|---|
| Reuse portfolio schema as `works` | `works: createPortfolioCollection('works/**/*.md')` in `content.config.ts` |
| Query custom-named collection | `createPortfolioComposables('works')` → `useItems` / `useItem` |
| Disable the gallery section | `contentLayer: { sections: { gallery: false } }` in `app.config.ts` |
| Disable multiple sections | List each with `false` in `sections` |

---

# Migration Guide: v1.5.x → v1.6.0

v1.6.0 restructures the layout and content systems. The main theme is **opt-in chrome** — header, footer, and nav are no longer always-on, full-bleed pages now use `layout: false`, and the global Locomotive Scroll wrapper is gone.

---

## Breaking Changes

### 1. `grid.vue` layout now requires explicit props for header/footer

Header and footer are no longer rendered by default. Pages that relied on `layout: 'grid'` to get them must now pass props.

**Before (v1.5.x):**
```ts
definePageMeta({ layout: 'grid' })
// header + footer always rendered
```

**After (v1.6.0):**
```ts
// Opt-in to header and footer:
definePageMeta({
  layout: { name: 'grid', props: { showHeader: true, showFooter: true } },
})

// No chrome needed (content-only page):
definePageMeta({ layout: 'grid' })

// Full-bleed pages (no mastmain grid at all):
definePageMeta({ layout: false })
```

Available props on `grid.vue` (all `boolean`, default `false`):

| Prop | Description |
|---|---|
| `showHeader` | Renders `<MastHeader>` |
| `showNav` | Renders `<MastNav>` |
| `showFooter` | Renders `<MastFooter>` |
| `showGridDebug` | Renders `<LayoutGridDebug>` overlay |

---

### 2. `MastScroller` removed

The global Locomotive Scroll wrapper in `default.vue` has been removed. Smooth scroll is now per-page via the `useSmoothScroll()` composable.

**Before (v1.5.x):**
```vue
<!-- default.vue automatically wrapped everything in MastScroller -->
<!-- No per-page setup required -->
```

**After (v1.6.0):**
```ts
// In any page that needs smooth scroll:
const { scrollTo, scrollToTop, velocity, progress } = useSmoothScroll()
```

Pages that don't call `useSmoothScroll()` will use native browser scroll — no behaviour change for those pages.

---

### 3. `LayoutPageContainer` deprecated → use `LayoutPage`

`LayoutPageContainer` has been superseded by `LayoutPage`. The legacy component still exists for backwards compatibility but is no longer maintained.

**Before (v1.5.x):**
```vue
<LayoutPageContainer title="My Page" :show-header="false">
  <LayoutSection>...</LayoutSection>
</LayoutPageContainer>
```

**After (v1.6.0):**
```vue
<LayoutPage title="My Page">
  <LayoutSection>...</LayoutSection>
</LayoutPage>
```

**Key difference:** `LayoutPage` defaults `showHeader` to `false`. If you need the page header block, pass it explicitly:

```vue
<LayoutPage title="My Page" :show-header="true">
  ...
</LayoutPage>
```

---

### 4. Full-bleed / animation pages must use `layout: false`

Pages with custom full-screen sections (WebGL canvases, GSAP hero animations, horizontal scroll tracks) must opt out of `LayoutMain` entirely. Using `layout: 'grid'` constrains them to a single `1fr` column which breaks full-width layouts.

```ts
// Full-bleed or animation-heavy page:
definePageMeta({ layout: false })

// With SSR disabled (e.g. WebGL):
definePageMeta({ ssr: false, layout: false })
```

**Rule of thumb:**

- Page uses `LayoutSection` + `LayoutGridItem`? → `layout: 'grid'` (with props as needed)
- Page uses custom full-width `<div>`/`<section>` elements? → `layout: false`

---

### 5. Content composables: `useContentData` replaces bare `useAsyncData`

All built-in content composables now use `useContentData` — a `createUseAsyncData` wrapper with `dedupe: 'cancel'` — instead of calling `useAsyncData` directly. If you've extended or wrapped any content composables, update the inner call:

**Before (v1.5.x):**
```ts
return useAsyncData('my-key', () => queryCollection('blog').all())
```

**After (v1.6.0):**
```ts
return useContentData('my-key', () => queryCollection('blog').all())
```

`useContentData` is exported from the content layer and available as a Nuxt auto-import. The API is identical to `useAsyncData`.

---

### 6. `payloadExtraction: 'client'` (nuxt.config.ts)

Add this experimental flag to your app's `nuxt.config.ts` if you use content collections or data-heavy pages. It moves payload extraction to the client, reducing SSR bundle size for content-driven routes.

```ts
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: 'client',
  },
})
```

---

## Non-Breaking Additions

- **`MastNav` component** — renders `<nav><slot /></nav>`. Enable via `showNav: true` on the `grid.vue` layout.
- **`showGridDebug` prop** — `LayoutGridDebug` is now controlled by the `showGridDebug` prop on `grid.vue` instead of always rendering.

---

## Quick Reference

| Pattern | v1.5.x | v1.6.0 |
|---|---|---|
| Grid page with header + footer | `layout: 'grid'` | `layout: { name: 'grid', props: { showHeader: true, showFooter: true } }` |
| Grid page, no chrome | `layout: 'grid'` | `layout: 'grid'` |
| Full-bleed / animation page | `layout: 'grid'` (broken) | `layout: false` |
| Page wrapper component | `<LayoutPageContainer>` | `<LayoutPage>` |
| Global smooth scroll | `MastScroller` in layout (auto) | `useSmoothScroll()` per-page |
| Content async data | `useAsyncData(...)` | `useContentData(...)` |
