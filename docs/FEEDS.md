# Adding Feeds to Your Content Sections

How to expose your Nuxt Content collections as **RSS 2.0**, **Atom 1.0**, and **JSON Feed 1.1** using the `feeds` layer (`layers/feeds`).

The layer provides everything server-side — feed routes, format serializers, XSLT browser styling, and `<head>` autodiscovery. Your app only has to do three things: **register the layer**, **declare which collections to expose**, and **prerender the collection routes** (for static/Netlify hosting).

> **Prerequisite:** the site `app.config.ts` must define a top-level `site` key (`title`, `url`, `author`, …). Feeds read it for channel metadata. If you're coming from an older version where this lived under `feedsLayer.site`, do the breaking-change migration in [`MIGRATION.md`](./MIGRATION.md) first.

---

## How it works

```
content collection ──> content-adapter ──> feed-service ──> rss / atom / json serializer ──> /feed/... route
   (queryCollection)     (drop drafts,        (channel meta        (format-specific XML/JSON)
                          sort by date,         from `site`)
                          slice to limit)
```

- `layers/feeds/server/utils/content-adapter.ts` — queries a collection, drops `draft` items, sorts newest-first by `date` (falling back to `createdAt`), slices to `limit`, and maps each item to a `FeedItem`.
- `layers/feeds/server/utils/feed-service.ts` + `formats/` — build the channel from `site` config and serialize to each format.
- `layers/feeds/app/plugins/feed-head.ts` — injects `<link rel="alternate">` discovery tags.
- `/feed/style.xsl` — stylesheet so feeds render as a styled page in a browser, not raw XML.

You don't edit any of these. You configure them.

---

## Step 1 — Register the `feeds` layer

The feeds layer depends on `core` and `content`. Register all three (Nuxt deduplicates, so listing an already-present dependency is free).

**Direct `extends`:**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../layers/core', '../layers/content', '../layers/feeds'],
})
```

**Resolver-style (like the playground):**

```ts
const AVAILABLE_LAYERS = [/* ...existing... */, 'content', 'feeds'] as const

const LAYER_PATHS = {
  /* ... */
  content: '../../layers/content',
  feeds: '../../layers/feeds',
}

const LAYER_DEPENDENCIES = {
  /* ... */
  content: ['core'],
  feeds: ['core', 'content'],
}
```

---

## Step 2 — Declare which collections become feeds

Feeds are driven by `feedsLayer.feed.collections` in `app/app.config.ts`. The default is `['blog']`. Each name must match a key in your app's `content.config.ts` `collections` object.

```ts
// app/app.config.ts
export default defineAppConfig({
  site: {
    title: 'My Site',
    description: 'What the site is about',
    url: 'https://example.com',          // canonical origin, no trailing slash
    author: { name: 'Jane', email: 'jane@example.com' },
  },
  feedsLayer: {
    feed: {
      limit: 30,                          // max items per feed
      collections: ['blog', 'portfolio'], // every collection to expose
      defaultCollection: 'blog',          // backs the /feed/rss shorthand routes
    },
  },
})
```

| Option | Default | Meaning |
|--------|---------|---------|
| `limit` | `30` | Max items included in each feed |
| `collections` | `['blog']` | Collection names to expose as feeds |
| `defaultCollection` | `'blog'` | Collection served by the shorthand `/feed/rss` routes |

---

## Step 3 — Routes you now get for free

Every configured collection serves:

| URL | Format |
|-----|--------|
| `/feed/:collection/rss` | RSS 2.0 |
| `/feed/:collection/atom` | Atom 1.0 |
| `/feed/:collection/json` | JSON Feed 1.1 |

Plus site-wide shorthand and index routes:

| URL | Purpose |
|-----|---------|
| `/feed/rss`, `/feed/atom`, `/feed/json` | Shorthand → serves `defaultCollection` |
| `/feed` | JSON index of all configured feeds |
| `/feed/style.xsl` | Browser stylesheet (applied automatically) |

Opening any feed URL in a browser shows a styled page thanks to the XSLT stylesheet — no app work required.

---

## Step 4 — Prerender collection routes (required for static / Netlify)

Feed routes are **server routes**. The prerender crawler can't discover `/feed/:collection/*` because nothing links to them with an `<a href>`. The feeds layer already prerenders the **shorthand** routes (`/feed`, `/feed/rss`, `/feed/atom`, `/feed/json`, `/feed/style.xsl`). You must list the **collection-specific** routes in your app's `nuxt.config.ts` — one trio per collection in `feedsLayer.feed.collections`:

```ts
// nuxt.config.ts
nitro: {
  prerender: {
    routes: [
      '/feed/blog/rss',
      '/feed/blog/atom',
      '/feed/blog/json',
      // repeat for every other collection, e.g. portfolio:
      '/feed/portfolio/rss',
      '/feed/portfolio/atom',
      '/feed/portfolio/json',
    ],
  },
},
```

**Omitting these makes collection feeds return 404 on Netlify and other static hosts.** Reference: `apps/playground/nuxt.config.ts` → `nitro.prerender.routes`.

> Running a Node server (SSR) instead of static prerendering? This step is optional — the routes are served on demand. It only matters for fully prerendered/static deploys.

---

## Step 5 — `<head>` autodiscovery (automatic)

The `feed-head.ts` plugin injects `<link rel="alternate">` tags so RSS readers and browsers discover your feeds. The rule:

- **Every page** gets the 3 main site feeds (shorthand routes → `defaultCollection`).
- A page whose first path segment matches a **non-default** collection (e.g. `/portfolio/...`) **also** gets that collection's 3 specific feeds.

| Page | Links injected |
|------|----------------|
| `/`, `/about`, any non-collection page | 3 main site feeds |
| `/blog`, `/blog/hello` (when `blog` is the default) | 3 main site feeds (already point to blog) |
| `/portfolio`, `/portfolio/project` (non-default collection) | 3 main + 3 portfolio feeds |

**Do nothing.** Don't hand-add `<link rel="alternate">` tags — you'll duplicate them.

---

## Aliased collections

If you've aliased a collection (e.g. reused the portfolio schema as `works` via `createPortfolioCollection('works/**/*.md')` in `content.config.ts`), feeds work the same way — add the alias name to `feedsLayer.feed.collections` and its routes to `nitro.prerender.routes`:

```ts
// app.config.ts
feedsLayer: { feed: { collections: ['blog', 'works'] } }

// nuxt.config.ts
nitro: { prerender: { routes: ['/feed/works/rss', '/feed/works/atom', '/feed/works/json'] } }
```

See `MIGRATION.md` → "Collection Aliases" for how to define the alias itself.

---

## Verify

1. `pnpm dev`, then load:
   - `/feed/rss` → styled XML, items present, `<author>` / `link` populated from frontmatter.
   - `/feed/<collection>/json` for each configured collection → JSON Feed 1.1 with items.
   - `/feed` → index lists every configured collection.
2. View source on a content page → `<link rel="alternate" ...>` tags present (a non-default-collection page has the extra trio).
3. **Static/Netlify:** `pnpm build`, then confirm each `/feed/<collection>/*` route emitted a static file with no 404 warnings in the prerender log.

---

## Quick reference

| Goal | Action |
|------|--------|
| Turn on feeds | Register `core` + `content` + `feeds` layers |
| Expose a collection | Add its name to `feedsLayer.feed.collections` |
| Set the shorthand target | `feedsLayer.feed.defaultCollection` |
| Cap items per feed | `feedsLayer.feed.limit` |
| Static hosting | Add `/feed/<collection>/{rss,atom,json}` to `nitro.prerender.routes` |
| Autodiscovery in `<head>` | Automatic — nothing to do |
| Feed channel metadata | Top-level `site` config in `app.config.ts` |
