# 📡 Production Feed Layer (Nuxt 3)

A fully decoupled, format-agnostic syndication system for Nuxt Content.
Provides:

- RSS 2.0
- Atom 1.0
- JSON Feed 1.1
- XSLT human-readable feed UI
- Tailwind-styled feed interface
- Collection-aware feed endpoints
- Fully cacheable server outputs
  Built for Nuxt 3 and Nuxt Content.

---

# 🧠 Core Principles

## 1. Canonical model first

All formats derive from a single structure:

> `FeedItem[]`

## No format-specific logic exists in content queries.

## 2. Format adapters are pure functions

Each format is isolated:

- RSS → `feed` npm package
- Atom → manual XML
- JSON Feed → JSON builder

---

## 3. UI is separate from feed semantics

- XSLT transforms RSS → HTML
- Tailwind styles only the human view
- Feed consumers never see UI logic

---

## 4. Routes are thin orchestration layers

## All logic lives in runtime/services.

## 5. Fully cacheable outputs

Feeds are deterministic and safe for:

- CDN caching
- ETags
- edge caching

---

# 📁 Folder Structure

layers/feed/
│
├── server/
│ └── routes/
│ └── feed/
│ ├── index.get.ts
│ ├── rss.get.ts
│ ├── atom.get.ts
│ ├── json.get.ts
│ │
│ └── [collection]/
│ ├── rss.get.ts
│ ├── atom.get.ts
│ └── json.get.ts
│
├── runtime/
│ ├── feed.service.ts
│ ├── content.adapter.ts
│ ├── feed.builder.ts
│ └── cache.ts
│
├── formats/
│ ├── rss.ts
│ ├── atom.ts
│ └── json.ts
│
├── ui/
│ ├── feed.css
│ └── rss.xsl
│
├── types/
│ └── feed.ts
│
└── README.md

---

# 🧱 Canonical Feed Model

```ts
export interface FeedItem {
  title: string
  description?: string
  link: string
  id: string
  date: Date
  author?: string
  tags?: string[]
}
```

⸻

🔌 Content Adapter Layer

Fetches content from Nuxt Content and maps to canonical model.

```ts
import { queryContent } from '#content/server'

export async function getFeedItems(collection?: string) {
  const query = queryContent(collection || '')
  const items = await query.where({ _draft: false }).sort({ date: -1 }).limit(30).find()
  return items.map((p) => ({
    title: p.title,
    description: p.description,
    link: p._path,
    id: p._path,
    date: new Date(p.date),
    tags: p.tags,
  }))
}
```

⸻

⚙️ Feed Service Layer

Central orchestration layer.

```ts
export async function buildFeed(collection?: string) {
  return await getFeedItems(collection)
}
```

⸻

📦 Format Adapters

⸻

RSS (feed npm package)

```ts
import { Feed } from 'feed'

export function toRSS(items, config) {
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.siteUrl,
    link: config.siteUrl,
    updated: new Date(),
  })
  for (const item of items) {
    feed.addItem({
      title: item.title,
      id: item.id,
      link: `${config.siteUrl}${item.link}`,
      description: item.description,
      date: item.date,
    })
  }
  return feed.rss2()
}
```

⸻

Atom (manual XML)

```ts
export function toAtom(items, config) {
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">

  <title>${config.title}</title>
  <id>${config.siteUrl}</id>
  <updated>${new Date().toISOString()}</updated>
  ${items
    .map(
      (i) => `
    <entry>
      <title>${i.title}</title>
      <id>${i.id}</id>
      <link href="${config.siteUrl}${i.link}" />
      <updated>${i.date.toISOString()}</updated>
      <summary>${i.description || ''}</summary>
    </entry>
  `
    )
    .join('')}
</feed>`
}
```

⸻

JSON Feed

```ts
export function toJSONFeed(items, config) {
  return {
    version: 'https://jsonfeed.org/version/1',
    title: config.title,
    home_page_url: config.siteUrl,
    feed_url: `${config.siteUrl}/feed/json`,
    items: items.map((i) => ({
      id: i.id,
      url: `${config.siteUrl}${i.link}`,
      title: i.title,
      content_text: i.description,
      date_published: i.date,
    })),
  }
}
```

⸻

🌍 Route Layer (Thin Orchestration)

Global RSS

```ts
import { toRSS } from '../../formats/rss'
import { buildFeed } from '../../runtime/feed.service'

export default defineEventHandler(async () => {
  const items = await buildFeed()
  return toRSS(items, {
    title: 'Site Feed',
    description: 'Latest content',
    siteUrl: 'https://your-site.com',
  })
})
```

⸻

Collection feeds

const collection = event.context.params.collection
const items = await buildFeed(collection)

Same logic applies to all formats.

⸻

🎨 UI Layer (Human View Only)

Feed stylesheet (feed.css)

- Tailwind-based utility styling
- only used in XSLT view
- not part of feed logic

⸻

XSLT responsibilities

- transform RSS → HTML
- apply /feed.css
- render:
  - title
  - feed items
  - actions

⸻

Subscribe button

`feed://your-domain.com/feed/rss`

Fallback:

- `/feed/rss`
- `/feed/atom`

⸻

Copy to clipboard

`navigator.clipboard.writeText(window.location.href)`

⸻

⚡ Caching Strategy

ETags

`setHeader(event, 'ETag', hash(content))`

⸻

Cache control

`cache-control: public, max-age=300, s-maxage=3600`

⸻

Optional Nitro caching

- per collection caching
- invalidation on content update

⸻

🔐 Rules

- No UI logic in formatters
- No format coupling
- No mutation of FeedItem in adapters
- XSLT must not affect feed semantics

⸻

📡 Final API Surface

Global feeds

- `/feed/rss`
- `/feed/atom`
- `/feed/json`

Collection feeds

- `/feed/:collection/rss`
- `/feed/:collection/atom`
- `/feed/:collection/json`

Optional

- `/feed` → index of available feeds

⸻

🧭 Summary

This system provides:

- Multi-format content syndication
- Clean separation of concerns
- Fully cacheable outputs
- Human-readable XSL feed UI
- Tailwind-powered styling layer
- Collection-aware feed generation

⸻

🚀 Outcome

You now have a:

Production-grade syndication layer that behaves like an internal publishing API.

It is:

- extensible
- framework-aligned
- cache-friendly
- UI-enhanced
- format-agnostic
