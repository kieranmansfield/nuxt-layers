# Nuxt Metadata Layers Plan

## Purpose

Create a reusable Nuxt layer system for fetching, normalising, caching, and serving external metadata from services such as Comic Vine, Open Library, Google Books, and future providers.

The metadata system should treat external APIs as upstream enrichment providers, not as the source of truth for the app.

## Core Principle

```txt
External APIs = upstream metadata providers
Metadata layer = common contracts, cache, normalisation, routes
Provider sublayers = service-specific API integrations
App/domain layers = consume normalised metadata
```

The Nuxt app should never directly depend on Comic Vine, Open Library, or Google Books. It should depend on a stable internal metadata interface.

---

## Proposed Layer Structure

```txt
layers/
  metadata/
    # Shared metadata contracts, provider registry, cache, API routes

  metadata-comicvine/
    # Comic Vine provider implementation

  metadata-openlibrary/
    # Open Library provider implementation

  metadata-google-books/
    # Google Books provider implementation

  metadata-local/
    # Optional manual/local JSON or YAML provider
```

Potential package names:

```txt
@kmcom/nuxt-metadata
@kmcom/nuxt-metadata-comicvine
@kmcom/nuxt-metadata-openlibrary
@kmcom/nuxt-metadata-google-books
@kmcom/nuxt-metadata-local
```

---

## Layer Responsibilities

## 1. `metadata` Layer

The base metadata layer owns all shared concepts.

Responsibilities:

```txt
- Provider registry
- Shared metadata types
- Normalised models
- Server-side metadata cache
- Sync utilities
- Search orchestration
- Provider priority rules
- Nitro API routes
- Error handling
- Rate-limit abstractions
- Raw response storage helpers
```

It should not know the implementation details of Comic Vine, Open Library, or Google Books.

Suggested structure:

```txt
layers/metadata/
  nuxt.config.ts
  app/
    composables/
      useMetadataSearch.ts
      useMetadataItem.ts
  server/
    api/
      metadata/
        search.get.ts
        lookup.get.ts
        providers.get.ts
        sync.post.ts
    utils/
      metadata/
        provider-registry.ts
        cache.ts
        normalise.ts
        types.ts
        errors.ts
        rate-limit.ts
  shared/
    types/
      metadata.ts
      providers.ts
      identifiers.ts
```

---

## 2. Provider Sublayers

Provider sublayers implement the shared metadata contracts.

Each provider layer should contain:

```txt
- API client
- Provider-specific response types
- Normalisers
- Provider registration
- Runtime config keys
- Rate-limit behaviour
- Sync helpers
```

Example:

```txt
layers/metadata-comicvine/
  nuxt.config.ts
  server/
    utils/
      metadata-comicvine/
        client.ts
        provider.ts
        normalise-issue.ts
        normalise-volume.ts
        types.ts
```

---

## Provider Registry

The metadata layer should expose a provider registry.

```ts
export type MetadataProviderId =
  | 'comicvine'
  | 'openlibrary'
  | 'google-books'
  | 'local'

export type MetadataProvider = {
  id: MetadataProviderId
  label: string
  mediaTypes: MetadataMediaType[]
  search: (input: MetadataSearchInput) => Promise<MetadataSearchResult[]>
  lookup: (input: MetadataLookupInput) => Promise<MetadataRecord | null>
  sync?: (input: MetadataSyncInput) => Promise<MetadataRecord>
}
```

Provider sublayers register themselves into this registry.

The app should call:

```ts
const results = await searchMetadata({
  query: 'Batman Year One',
  mediaType: 'comic',
})
```

not:

```ts
await searchComicVine(...)
```

---

## Normalised Metadata Model

The base metadata layer should return normalised records.

```ts
export type MetadataMediaType =
  | 'book'
  | 'comic'
  | 'manga'
  | 'graphic-novel'
  | 'collected-edition'

export type MetadataRecord = {
  id: string
  provider: MetadataProviderId
  providerId: string
  mediaType: MetadataMediaType
  title: string
  subtitle?: string
  description?: string
  creators?: MetadataCreator[]
  publisher?: string
  publishedAt?: string
  coverUrl?: string
  identifiers?: MetadataIdentifiers
  sourceUrl?: string
  raw?: unknown
  lastSyncedAt?: string
}

export type MetadataCreator = {
  name: string
  role?: string
  providerId?: string
}

export type MetadataIdentifiers = {
  isbn10?: string
  isbn13?: string
  comicVineId?: string
  openLibraryId?: string
  googleBooksId?: string
}
```

---

## Comic Vine Provider

Use Comic Vine for comics metadata.

Best suited for:

```txt
- Single issues
- Volumes / series
- Characters
- Creators
- Publishers
- Cover dates
- Issue numbers
```

Important design rule:

```txt
Never call Comic Vine from the browser.
Always call it through Nitro server utilities/routes.
Cache aggressively.
```

Suggested resources:

```txt
issue
volume
character
person
publisher
concept
object
location
```

Suggested config:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    comicVine: {
      apiKey: process.env.COMIC_VINE_API_KEY,
      baseUrl: 'https://comicvine.gamespot.com/api',
      cacheTtl: 60 * 60 * 24 * 30,
    },
  },
})
```

Rate-limit strategy:

```txt
- Cache by provider/resource/id
- Debounce repeated searches
- Store raw responses
- Prefer explicit sync/import over live page-load requests
- Refresh old records on a schedule
- Use stale-while-revalidate behaviour where possible
```

---

## Open Library Provider

Use Open Library as the primary open book metadata provider.

Best suited for:

```txt
- Books
- Novels
- Non-fiction
- ISBN lookup
- Author metadata
- Work/edition relationships
- Covers
- Trades or omnibuses with ISBNs
```

Provider features:

```txt
- Search by title/author
- Lookup by ISBN
- Work lookup
- Edition lookup
- Cover URL generation
```

---

## Google Books Provider

Use Google Books as a fallback/enrichment provider.

Best suited for:

```txt
- Missing descriptions
- Better thumbnails
- Publisher info
- Page count
- ISBN lookup
- Preview links
```

Provider priority:

```txt
Open Library primary for books
Google Books fallback for books/trades/omnibuses
Comic Vine primary for comic issues/volumes
```

---

## Metadata Cache

The metadata cache should store both normalised data and raw provider data.

```ts
export type MetadataCacheRecord = {
  id: string
  provider: MetadataProviderId
  providerId: string
  resourceType: string
  mediaType: MetadataMediaType
  normalised: MetadataRecord
  raw: unknown
  createdAt: string
  updatedAt: string
  lastSyncedAt: string
  expiresAt?: string
}
```

Cache key format:

```txt
metadata:{provider}:{resourceType}:{providerId}
metadata-search:{provider}:{mediaType}:{queryHash}
```

Refresh rules:

```txt
Recent/upcoming comics: daily or weekly
Tracked comics: monthly
Older comics: manually or quarterly
Books/trades/omnibuses: monthly or manually
Characters/creators/publishers: monthly or quarterly
```

---

## Nitro API Routes

Suggested public server routes:

```txt
GET  /api/metadata/providers
GET  /api/metadata/search?q=&mediaType=&providers=
GET  /api/metadata/lookup?provider=&providerId=&resourceType=
POST /api/metadata/sync
```

Suggested internal utilities:

```ts
await searchMetadata(input)
await lookupMetadata(input)
await syncMetadata(input)
await getCachedMetadata(input)
await refreshMetadata(input)
```

---

## Search Orchestration

Search should support provider priority and fallback behaviour.

Example:

```ts
await searchMetadata({
  query: 'Batman Year One',
  mediaType: 'comic',
  providers: ['comicvine', 'openlibrary', 'google-books'],
})
```

Suggested behaviour:

```txt
1. Check cached search result.
2. Query preferred provider.
3. Normalise results.
4. Optionally query fallback providers.
5. Deduplicate by identifiers/title/year.
6. Return provider-tagged results.
```

---

## Manual Overrides

The metadata layer should allow local/manual corrections.

Why:

```txt
- Comic metadata is messy
- Collected editions often have inconsistent issue lists
- Covers may be wrong
- Publication dates may conflict with cover dates
- Reading-order placement is editorial, not factual metadata
```

Suggested local override shape:

```yaml
id: batman-year-one
provider: comicvine
providerId: '4045-xxxx'
overrides:
  title: Batman: Year One
  coverUrl: /images/covers/batman-year-one.jpg
  description: Custom curated description.
```

---

## Security

Rules:

```txt
- Keep API keys server-side only
- Never expose Comic Vine keys to the browser
- Use Nitro server routes as the boundary
- Validate query input
- Rate-limit public search routes
- Cache results before returning them where possible
```

---

## MVP Implementation Order

1. Create `metadata` base layer.
2. Define shared types and provider contract.
3. Add provider registry.
4. Add Nitro search and lookup routes.
5. Add simple cache abstraction.
6. Add `metadata-comicvine` provider.
7. Add Comic Vine issue/volume search.
8. Add raw + normalised cache storage.
9. Add `metadata-openlibrary` provider.
10. Add `metadata-google-books` provider.
11. Add fallback/deduplication rules.
12. Add manual override support.
13. Add sync script/job.

---

## Long-Term Additions

Potential future providers:

```txt
metadata-hardcover
metadata-marvel
metadata-dc-wiki
metadata-wikidata
metadata-isbn-db
metadata-local-json
metadata-manual
```

Potential future features:

```txt
- Provider confidence scoring
- Metadata merge UI
- Manual correction dashboard
- Background sync queue
- Import by ISBN
- Import by Comic Vine URL
- Cover image proxy/cache
- Graph-based entity relationships
- Duplicate detection
```
