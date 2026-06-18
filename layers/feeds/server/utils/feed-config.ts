import type { SiteConfig } from '#layers/core/app/types/site'

import type { FeedConfig } from './types'

type AppFeedConfig = {
  site?: SiteConfig
  feedsLayer?: {
    feed?: {
      limit?: number
      defaultCollection?: string
    }
  }
}

type FeedLayerConfig = NonNullable<AppFeedConfig['feedsLayer']>['feed']

function resolveFeedTitle(site: SiteConfig, collection: string | undefined) {
  const collectionLabel = collection
    ? ` — ${collection.charAt(0).toUpperCase() + collection.slice(1)}`
    : ''

  return `${site.title ?? 'My Site'}${collectionLabel}`
}

function resolveFeedAuthorName(author: SiteConfig['author']) {
  const authorName = author?.name ?? ''
  return authorName.length > 0 ? authorName : undefined
}

function resolveFeedAuthor(site: SiteConfig) {
  const authorName = resolveFeedAuthorName(site.author)
  return authorName
    ? { name: authorName, email: site.author?.email, link: site.author?.link }
    : undefined
}

function resolveFeedCopyright(site: SiteConfig) {
  const authorName = resolveFeedAuthorName(site.author)
  if (site.copyright) return site.copyright
  if (!authorName) return undefined
  return `Copyright ${new Date().getFullYear()} ${authorName}`
}

function resolveConfiguredFeedLimit(feedConfig: FeedLayerConfig) {
  return feedConfig?.limit ?? 30
}

export function resolveFeedSiteConfig(appConfig: AppFeedConfig, requestUrl: URL) {
  const site = appConfig.site ?? {}
  const origin = `${requestUrl.protocol}//${requestUrl.host}`
  return {
    site,
    siteUrl: (site.url as string | undefined)?.replace(/\/$/, '') || origin,
  }
}

export function resolveFeedCollection(
  feedConfig: FeedLayerConfig,
  collection?: string
) {
  return collection ?? feedConfig?.defaultCollection ?? 'blog'
}

export function createFeedConfig(args: {
  site: SiteConfig
  siteUrl: string
  collection: string | undefined
}): FeedConfig {
  const { site, siteUrl, collection } = args

  return {
    title: resolveFeedTitle(site, collection),
    description: site.description ?? '',
    siteUrl,
    author: resolveFeedAuthor(site),
    image: site.image || undefined,
    favicon: site.favicon ?? '/favicon.ico',
    copyright: resolveFeedCopyright(site),
  }
}

export function resolveFeedLimit(
  feedConfig: FeedLayerConfig,
  options?: { unlimited?: boolean | undefined }
) {
  if (options?.unlimited) return Infinity
  return resolveConfiguredFeedLimit(feedConfig)
}
