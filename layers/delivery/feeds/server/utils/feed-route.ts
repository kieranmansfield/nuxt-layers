import { defineEventHandler, getRouterParam, setHeader } from 'h3'

import { setFeedCacheHeaders } from './cache'
import { buildFeed } from './feed-service'
import { toAtom } from './formats/atom'
import { toJSONFeed } from './formats/json'
import { toRSS } from './formats/rss'

/** Handler for `/feed/[collection]/<format>` (and `/all` when `unlimited`). */
export function defineCollectionFeedRoute(
  format: 'rss' | 'atom' | 'json',
  { unlimited = false }: { unlimited?: boolean } = {}
) {
  return defineEventHandler(async (event) => {
    const collection = getRouterParam(event, 'collection')
    const { items, config } = await buildFeed(
      event,
      collection,
      unlimited ? { unlimited: true } : undefined
    )
    if (format === 'json') {
      const body = toJSONFeed(items, config)
      setFeedCacheHeaders(event, JSON.stringify(body))
      setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
      return body
    }
    const content = format === 'atom' ? toAtom(items, config) : toRSS(items, config)
    setFeedCacheHeaders(event, content)
    setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
    return content
  })
}
