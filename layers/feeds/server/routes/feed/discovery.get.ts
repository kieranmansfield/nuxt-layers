export default defineEventHandler((event) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appConfig = useAppConfig() as any
  const feedConfig = appConfig.feedsLayer?.feed ?? {}
  const collections: string[] = feedConfig.collections ?? ['blog']

  const requestUrl = getRequestURL(event)
  // Always use the request origin so discovery URLs are reachable from wherever
  // the request came from, not the configured canonical site URL.
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`

  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')

  const formats = [
    { format: 'RSS 2.0', ext: 'rss', contentType: 'application/rss+xml' },
    { format: 'Atom 1.0', ext: 'atom', contentType: 'application/atom+xml' },
    { format: 'JSON Feed 1.1', ext: 'json', contentType: 'application/feed+json' },
  ]

  return {
    feeds: collections.flatMap((collection) =>
      formats.map(({ format, ext, contentType }) => ({
        collection,
        format,
        url: `${baseUrl}/feed/${collection}/${ext}`,
        contentType,
      }))
    ),
  }
})
