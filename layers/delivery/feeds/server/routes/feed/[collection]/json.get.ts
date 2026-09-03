export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const { items, config } = await buildFeed(event, collection)
  const body = toJSONFeed(items, config)
  const content = JSON.stringify(body)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  return body
})
