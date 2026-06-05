export default defineEventHandler((event) => {
  const appConfig = useAppConfig()
  const configuredUrl =
    (appConfig as { feedsLayer?: { site?: { url?: string } } }).feedsLayer?.site?.url ?? ''

  // Fall back to the request origin so local dev links work without configuration
  const requestUrl = getRequestURL(event)
  const baseUrl = configuredUrl || `${requestUrl.protocol}//${requestUrl.host}`

  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')

  return {
    feeds: [
      { format: 'RSS 2.0', url: `${baseUrl}/feed/rss`, contentType: 'application/rss+xml' },
      { format: 'Atom 1.0', url: `${baseUrl}/feed/atom`, contentType: 'application/atom+xml' },
      {
        format: 'JSON Feed 1.1',
        url: `${baseUrl}/feed/json`,
        contentType: 'application/feed+json',
      },
    ],
  }
})
