export default defineEventHandler(async (event) => {
  const { items, config } = await buildFeed(event)
  const content = toAtom(items, config)
  setFeedCacheHeaders(event, content)
  setHeader(event, 'Content-Type', 'application/atom+xml; charset=utf-8')
  return content
})
