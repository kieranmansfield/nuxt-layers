import type { FeedConfig, FeedItem } from './types'

export function resolveFeedItemId(siteUrl: string, item: FeedItem) {
  return `${siteUrl}${item.id}`
}

export function resolveFeedItemLink(siteUrl: string, item: FeedItem) {
  return `${siteUrl}${item.link}`
}

export function applyFeedStylesheet(xml: string) {
  return xml.replace(
    /<\?xml version="1\.0" encoding="utf-8"\?>/i,
    '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/feed/style.xsl"?>'
  )
}

export function resolveFeedAuthorPayload(config: FeedConfig['author']) {
  return config
    ? {
        name: config.name,
        ...(config.email ? { email: config.email } : {}),
        ...(config.link ? { link: config.link } : {}),
      }
    : undefined
}
