import { Feed } from 'feed'

import type { FeedConfig, FeedItem } from '../types'

export function toRSS(items: FeedItem[], config: FeedConfig): string {
  const author = config.author
    ? {
        name: config.author.name,
        ...(config.author.email ? { email: config.author.email } : {}),
        ...(config.author.link ? { link: config.author.link } : {}),
      }
    : undefined

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
      id: `${config.siteUrl}${item.id}`,
      link: `${config.siteUrl}${item.link}`,
      ...(item.description ? { description: item.description } : {}),
      date: item.date,
      ...(item.author ? { author: [{ name: item.author }] } : {}),
    })
  }

  const raw = feed.rss2()
  return raw.replace(
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/feed/style.xsl"?>'
  )
}
