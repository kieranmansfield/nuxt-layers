import type { H3Event } from 'h3'

import type { FeedConfig, FeedItem } from './types'

export async function buildFeed(
  event: H3Event,
  collection?: string
): Promise<{ items: FeedItem[]; config: FeedConfig }> {
  const appConfig = useAppConfig()
  const site =
    (appConfig as { feedsLayer?: { site?: Record<string, unknown>; feed?: { limit?: number } } })
      .feedsLayer?.site ?? {}
  const feedConfig =
    (appConfig as { feedsLayer?: { feed?: { limit?: number } } }).feedsLayer?.feed ?? {}

  const config: FeedConfig = {
    title: (site.title as string) ?? 'My Site',
    description: (site.description as string) ?? '',
    siteUrl: (site.url as string) ?? '',
    author: site.author as FeedConfig['author'],
    image: site.image as string | undefined,
    favicon: (site.favicon as string) ?? '/favicon.ico',
    copyright:
      (site.copyright as string) ||
      `Copyright ${new Date().getFullYear()} ${(site.author as { name?: string } | undefined)?.name ?? ''}`.trim(),
  }

  const limit = feedConfig.limit ?? 30
  const items = await getContentFeedItems(event, collection, limit)

  return { items, config }
}
