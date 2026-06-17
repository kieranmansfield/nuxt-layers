export type FeedFormatKey = 'rss' | 'atom' | 'json'

export type FeedManifestEntry = {
  type: string
  [key: string]: unknown
}

export type FeedManifest = Record<string, FeedManifestEntry | undefined>

export type FeedCatalogSiteInput = {
  title?: string
  description?: string
  url?: string
  author?: {
    name?: string
  }
}

export type FeedCatalogInput = {
  site?: FeedCatalogSiteInput
  feed?: {
    collections?: readonly string[]
    defaultCollection?: string
    limit?: number
  }
  manifest?: FeedManifest
}

export type FeedRoute = {
  kind: 'index' | 'format'
  label: string
  path: string
  format?: FeedFormatKey
  contentType?: string
}

export type FeedCollectionGroup = {
  collection: string
  label: string
  routes: FeedRoute[]
}

export type FeedCatalog = {
  site: {
    title: string
    description: string
    url: string
    author?: {
      name: string
    }
  }
  feed: {
    collections: string[]
    defaultCollection: string
    limit: number
    availableCollections: string[]
    missingCollections: string[]
  }
  siteRoutes: FeedRoute[]
  collectionGroups: FeedCollectionGroup[]
}

type FeedState = FeedCatalog['feed']

const FEED_FORMATS: Array<{ key: FeedFormatKey; label: string; contentType: string }> = [
  { key: 'rss', label: 'RSS 2.0', contentType: 'application/rss+xml' },
  { key: 'atom', label: 'Atom 1.0', contentType: 'application/atom+xml' },
  { key: 'json', label: 'JSON Feed 1.1', contentType: 'application/feed+json' },
]

function unique(values: readonly string[]): string[] {
  return [...new Set(values)]
}

export function formatFeedCollectionName(collection: string): string {
  return collection
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizeSiteUrl(url?: string): string {
  return url?.replace(/\/$/, '') ?? ''
}

function resolveAvailableCollections(manifest: FeedManifest | undefined): string[] {
  if (!manifest) {
    return []
  }

  return Object.entries(manifest)
    .filter(([, collection]) => collection?.type === 'page')
    .map(([name]) => name)
}

function resolveFeedState(
  feed: FeedCatalogInput['feed'],
  defaultCollection: string,
  availableCollections: string[]
): FeedState {
  const collections = unique(feed?.collections ?? [defaultCollection])
  const missingCollections = unique([defaultCollection, ...collections]).filter(
    (collection) => !availableCollections.includes(collection)
  )

  return {
    collections,
    defaultCollection,
    limit: feed?.limit ?? 30,
    availableCollections,
    missingCollections,
  }
}

function resolveSiteRoutes(): FeedRoute[] {
  return [
    { kind: 'index', label: 'Feed index', path: '/feed' },
    ...FEED_FORMATS.map(
      (format) =>
        ({
          kind: 'format',
          label: format.label,
          path: `/feed/${format.key}`,
          format: format.key,
          contentType: format.contentType,
        }) satisfies FeedRoute
    ),
  ]
}

function resolveCollectionGroups(
  collections: string[],
  availableCollections: string[],
  defaultCollection: string
): FeedCollectionGroup[] {
  return collections
    .filter((collection) => collection !== defaultCollection)
    .filter((collection) => availableCollections.includes(collection))
    .map((collection) => ({
      collection,
      label: formatFeedCollectionName(collection),
      routes: FEED_FORMATS.map(
        (format) =>
          ({
            kind: 'format',
            label: format.label,
            path: `/feed/${collection}/${format.key}`,
            format: format.key,
            contentType: format.contentType,
          }) satisfies FeedRoute
      ),
    }))
}

export function createFeedCatalog(input: FeedCatalogInput = {}): FeedCatalog {
  const site = input.site ?? {}
  const defaultCollection = input.feed?.defaultCollection ?? 'blog'
  const availableCollections = resolveAvailableCollections(input.manifest)
  const feed = resolveFeedState(input.feed, defaultCollection, availableCollections)

  return {
    site: {
      title: site.title ?? 'Site',
      description: site.description ?? '',
      url: normalizeSiteUrl(site.url),
      ...(site.author?.name
        ? {
            author: {
              name: site.author.name,
            },
          }
        : {}),
    },
    feed,
    siteRoutes: resolveSiteRoutes(),
    collectionGroups: resolveCollectionGroups(
      feed.collections,
      availableCollections,
      feed.defaultCollection
    ),
  }
}
