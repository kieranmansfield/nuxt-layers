import type { H3Event } from 'h3'

import type { FeedConfig, FeedItem } from './types'
import {
  createFeedConfig,
  resolveFeedCollection,
  resolveFeedLimit,
  resolveFeedSiteConfig,
} from './feed-config'

export async function buildFeed(
  event: H3Event,
  collection?: string,
  options?: { unlimited?: boolean }
): Promise<{ items: FeedItem[]; config: FeedConfig }> {
  const appConfig = useAppConfig()
  const feedConfig = appConfig.feedsLayer?.feed
  const requestUrl = getRequestURL(event)
  const { site, siteUrl } = resolveFeedSiteConfig(appConfig, requestUrl)
  const resolvedCollection = resolveFeedCollection(feedConfig, collection)
  const limit = resolveFeedLimit(feedConfig, options)

  const config = createFeedConfig({ site, siteUrl, collection })
  const items = await getContentFeedItems(event, resolvedCollection, limit)

  return { items, config }
}
