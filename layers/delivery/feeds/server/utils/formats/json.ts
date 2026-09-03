import type { FeedConfig, FeedItem } from '../types'

export function toJSONFeed(items: FeedItem[], config: FeedConfig): object {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.title,
    description: config.description,
    home_page_url: config.siteUrl,
    feed_url: `${config.siteUrl}/feed/json`,
    authors: config.author ? [{ name: config.author.name, url: config.author.link }] : undefined,
    items: items.map((item) => ({
      id: `${config.siteUrl}${item.id}`,
      url: `${config.siteUrl}${item.link}`,
      title: item.title,
      content_text: item.description,
      date_published: item.date.toISOString(),
      authors: item.author ? [{ name: item.author }] : undefined,
      tags: item.tags,
    })),
  }
}
