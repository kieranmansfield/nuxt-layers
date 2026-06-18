import { describe, expect, it } from 'vitest'

import { createFeedCatalog } from '../../layers/feeds/app/utils/feed-catalog'

describe('feed catalog smoke', () => {
  it('builds the default site routes from a minimal manifest', () => {
    const catalog = createFeedCatalog({
      manifest: {
        blog: { type: 'page' },
      },
    })

    expect(catalog.site.title).toBe('Site')
    expect(catalog.site.url).toBe('')
    expect(catalog.feed.defaultCollection).toBe('blog')
    expect(catalog.feed.collections).toEqual(['blog'])
    expect(catalog.feed.availableCollections).toEqual(['blog'])
    expect(catalog.feed.missingCollections).toEqual([])
    expect(catalog.siteRoutes.map((route) => route.path)).toEqual([
      '/feed',
      '/feed/rss',
      '/feed/atom',
      '/feed/json',
    ])
    expect(catalog.collectionGroups).toHaveLength(0)
  })
})
