export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event)
  const body = toJSONFeed(items, config)
  const content = JSON.stringify(body)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  return body
})
