import contentManifest from '#content/manifest'

import { createFeedCatalog } from '../../../app/utils/feed-catalog'

export default defineEventHandler((event) => {
  const appConfig = useAppConfig()

  const requestUrl = getRequestURL(event)
  // Always use the request origin so discovery URLs are reachable from wherever
  // the request came from, not the configured canonical site URL.
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`

  const catalog = createFeedCatalog({
    site: appConfig.site,
    feed: appConfig.feedsLayer?.feed,
    manifest: contentManifest,
  })

  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')

  return {
    feeds: catalog.collectionGroups.flatMap((group) =>
      group.routes.map((route) => ({
        collection: group.collection,
        format: route.label,
        url: `${baseUrl}${route.path}`,
        contentType: route.contentType ?? 'application/octet-stream',
      }))
    ),
  }
})
