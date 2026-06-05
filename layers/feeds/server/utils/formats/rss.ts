import { Feed } from 'feed'

import type { FeedConfig, FeedItem } from '../types'

export function toRSS(items: FeedItem[], config: FeedConfig): string {
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.siteUrl,
    link: config.siteUrl,
    image: config.image,
    favicon: config.favicon,
    copyright: config.copyright ?? '',
    updated: items[0]?.date ?? new Date(),
    author: config.author,
  })

  for (const item of items) {
    feed.addItem({
      title: item.title,
      id: `${config.siteUrl}${item.id}`,
      link: `${config.siteUrl}${item.link}`,
      description: item.description,
      date: item.date,
      author: item.author ? [{ name: item.author }] : undefined,
    })
  }

  return feed.rss2()
}
