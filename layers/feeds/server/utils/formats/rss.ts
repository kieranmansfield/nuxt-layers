import { Feed } from 'feed'

import type { FeedConfig, FeedItem } from '../types'
import {
  applyFeedStylesheet,
  resolveFeedAuthorPayload,
  resolveFeedItemId,
  resolveFeedItemLink,
} from '../feed-xml'

export function toRSS(items: FeedItem[], config: FeedConfig): string {
  const author = resolveFeedAuthorPayload(config.author)
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.siteUrl,
    link: config.siteUrl,
    ...(config.image ? { image: config.image } : {}),
    ...(config.favicon ? { favicon: config.favicon } : {}),
    copyright: config.copyright ?? '',
    updated: items[0]?.date ?? new Date(),
    ...(author ? { author } : {}),
  })

  for (const item of items) {
    feed.addItem({
      title: item.title,
      id: resolveFeedItemId(config.siteUrl, item),
      link: resolveFeedItemLink(config.siteUrl, item),
      ...(item.description ? { description: item.description } : {}),
      date: item.date,
      ...(item.author ? { author: [{ name: item.author }] } : {}),
    })
  }

  return applyFeedStylesheet(feed.rss2())
}
