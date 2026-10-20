import { buildFeed } from '../../../../utils/feed-service'
import { setFeedCacheHeaders } from '../../../../utils/cache'
import { toAtom } from '../../../../utils/formats/atom'
import { defineEventHandler, getRouterParam, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const { items, config } = await buildFeed(event, collection, { unlimited: true })
  const content = toAtom(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
  return content
})
