export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event, undefined, { unlimited: true })
  const content = toJSONFeed(items, config)
  setFeedCacheHeaders(event, JSON.stringify(content))
  setHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  return content
})
