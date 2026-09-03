export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const { items, config } = await buildFeed(event, collection, { unlimited: true })
  const content = toJSONFeed(items, config)
  setFeedCacheHeaders(event, JSON.stringify(content))
  setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  return content
})
