export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event)
  const content = toRSS(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return content
})
