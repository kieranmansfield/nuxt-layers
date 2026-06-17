import contentManifest from '#content/manifest'

import { createFeedCatalog } from '../utils/feed-catalog'

export default defineNuxtPlugin({
  name: 'feeds:feed-head',
  setup() {
    const appConfig = useAppConfig()
    const site = appConfig.site ?? {}
    const siteTitle: string = site.title ?? ''
    const catalog = createFeedCatalog({
      site: site,
      feed: appConfig.feedsLayer?.feed,
      manifest: contentManifest,
    })

    const route = useRoute()

    useHead(() => {
      // Derive which collection (if any) the current page belongs to
      const segment = route.path.split('/').filter(Boolean)[0] ?? ''
      const currentCollection = catalog.collectionGroups.find(
        (group) => group.collection === segment
      )

      // Always present: main site feeds via the shorthand routes
      const mainLinks = catalog.siteRoutes
        .filter((route) => route.kind === 'format')
        .map((route) => ({
          rel: 'alternate',
          type: route.contentType ?? 'application/octet-stream',
          title: `${siteTitle || 'Site'} (${route.label})`,
          href: route.path,
        }))

      // Collection-specific feeds — only when on a non-default collection's pages.
      // The default collection is already covered by the main shorthand links above.
      const collectionLinks =
        currentCollection && currentCollection.collection !== catalog.feed.defaultCollection
          ? currentCollection.routes.map((route) => ({
              rel: 'alternate',
              type: route.contentType ?? 'application/octet-stream',
              title: `${currentCollection.label} (${route.label})`,
              href: route.path,
            }))
          : []

      return { link: [...mainLinks, ...collectionLinks] }
    })
  },
})
