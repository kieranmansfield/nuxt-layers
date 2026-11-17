import contentManifest from '#content/manifest'

import { createFeedCatalog, type FeedCatalogInput } from '../utils/feed-catalog'

type AppFeedAppConfig = FeedCatalogInput & {
  feedsLayer?: { feed?: FeedCatalogInput['feed'] }
}

export default defineNuxtPlugin({
  name: 'feeds:feed-head',
  setup() {
    const appConfig = useAppConfig() as unknown as AppFeedAppConfig
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
      const segment = route.path.split('/').find(Boolean) ?? ''
      const currentCollection = catalog.collectionGroups.find(
        (group) => group.collection === segment
      )

      // Always present: main site feeds via the shorthand routes
      const mainLinks = catalog.siteRoutes
        .filter((feedRoute) => feedRoute.kind === 'format')
        .map((feedRoute) => ({
          rel: 'alternate' as const,
          type: feedRoute.contentType ?? 'application/octet-stream',
          title: `${siteTitle || 'Site'} (${feedRoute.label})`,
          href: feedRoute.path,
        }))

      // Collection-specific feeds — only when on a non-default collection's pages.
      // The default collection is already covered by the main shorthand links above.
      const collectionLinks =
        currentCollection && currentCollection.collection !== catalog.feed.defaultCollection
          ? currentCollection.routes.map((feedRoute) => ({
              rel: 'alternate' as const,
              type: feedRoute.contentType ?? 'application/octet-stream',
              title: `${currentCollection.label} (${feedRoute.label})`,
              href: feedRoute.path,
            }))
          : []

      return { link: [...mainLinks, ...collectionLinks] }
    })
  },
})
