import { buildFeed } from '../../utils/feed-service'
import { setFeedCacheHeaders } from '../../utils/cache'
import { toRSS } from '../../utils/formats/rss'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event)
  const content = toRSS(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
  return content
})
