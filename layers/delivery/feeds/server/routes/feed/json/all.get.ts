import { buildFeed } from '../../../utils/feed-service'
import { setFeedCacheHeaders } from '../../../utils/cache'
import { toJSONFeed } from '../../../utils/formats/json'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event, undefined, { unlimited: true })
  const content = toJSONFeed(items, config)
  setFeedCacheHeaders(event, JSON.stringify(content))
  setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  return content
})
