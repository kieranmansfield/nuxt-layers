import { buildFeed } from '../../utils/feed-service'
import { setFeedCacheHeaders } from '../../utils/cache'
import { toAtom } from '../../utils/formats/atom'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event)
  const content = toAtom(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
  return content
})
