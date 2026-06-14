export default defineNuxtPlugin({
  name: 'feeds:feed-head',
  setup() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appConfig = useAppConfig() as any
  const site = appConfig.site ?? {}
  const feedConfig = appConfig.feedsLayer?.feed ?? {}
  const collections: string[] = feedConfig.collections ?? ['blog']
  const defaultCollection: string = feedConfig.defaultCollection ?? 'blog'
  const siteTitle: string = site.title ?? ''

  const route = useRoute()

  useHead(() => {
    // Derive which collection (if any) the current page belongs to
    const segment = route.path.split('/').filter(Boolean)[0] ?? ''
    const currentCollection = collections.includes(segment) ? segment : null

    // Always present: main site feeds via the shorthand routes
    const mainLinks = [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: `${siteTitle || 'Site'} (RSS)`,
        href: '/feed/rss',
      },
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: `${siteTitle || 'Site'} (Atom)`,
        href: '/feed/atom',
      },
      {
        rel: 'alternate',
        type: 'application/feed+json',
        title: `${siteTitle || 'Site'} (JSON Feed)`,
        href: '/feed/json',
      },
    ]

    // Collection-specific feeds — only when on a non-default collection's pages.
    // The default collection is already covered by the main shorthand links above.
    const label =
      currentCollection && currentCollection !== defaultCollection
        ? currentCollection.charAt(0).toUpperCase() + currentCollection.slice(1)
        : null

    const collectionLinks = label
      ? [
          {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: `${label} (RSS)`,
            href: `/feed/${currentCollection}/rss`,
          },
          {
            rel: 'alternate',
            type: 'application/atom+xml',
            title: `${label} (Atom)`,
            href: `/feed/${currentCollection}/atom`,
          },
          {
            rel: 'alternate',
            type: 'application/feed+json',
            title: `${label} (JSON Feed)`,
            href: `/feed/${currentCollection}/json`,
          },
        ]
      : []

    return { link: [...mainLinks, ...collectionLinks] }
  })
  },
})
