export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const { items, config } = await buildFeed(event, collection)
  const content = toRSS(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')
  return content
})
