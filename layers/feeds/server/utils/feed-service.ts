/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { SiteConfig } from '#layers/core/app/types/site'
import type { H3Event } from 'h3'

import type { FeedConfig, FeedItem } from './types'

export async function buildFeed(
  event: H3Event,
  collection?: string,
  options?: { unlimited?: boolean }
): Promise<{ items: FeedItem[]; config: FeedConfig }> {
  const appConfig = useAppConfig()
  const site: SiteConfig = (appConfig as { site?: SiteConfig }).site ?? {}
  const feedConfig =
    (appConfig as { feedsLayer?: { feed?: { limit?: number; defaultCollection?: string } } })
      .feedsLayer?.feed ?? {}
  const limit: number = options?.unlimited ? Infinity : (feedConfig.limit ?? 30)
  const defaultCollection = feedConfig.defaultCollection ?? 'blog'

  const requestUrl = getRequestURL(event)
  const origin = `${requestUrl.protocol}//${requestUrl.host}`
  const siteUrl = (site.url as string | undefined)?.replace(/\/$/, '') || origin

  const authorName = site.author?.name ?? ''
  const resolvedCollection = collection ?? defaultCollection
  const collectionLabel = collection
    ? ` — ${collection.charAt(0).toUpperCase() + collection.slice(1)}`
    : ''

  const config: FeedConfig = {
    title: `${site.title ?? 'My Site'}${collectionLabel}`,
    description: site.description ?? '',
    siteUrl,
    author: authorName
      ? { name: authorName, email: site.author?.email, link: site.author?.link }
      : undefined,
    image: site.image || undefined,
    favicon: site.favicon ?? '/favicon.ico',
    copyright:
      site.copyright ||
      (authorName ? `Copyright ${new Date().getFullYear()} ${authorName}` : undefined),
  }

  const items = await getContentFeedItems(event, resolvedCollection, limit)

  return { items, config }
}
