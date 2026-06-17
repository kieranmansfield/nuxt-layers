import { describe, expect, it } from 'vitest'

import { createFeedCatalog } from './feed-catalog'

describe('createFeedCatalog', () => {
  it('builds the feed manifest from app config and content collections', () => {
    const catalog = createFeedCatalog({
      site: {
        title: 'Nuxt Layers Playground',
        description: 'Demo and development playground for nuxt-layers.',
        url: 'https://nuxtlayers.netlify.app/',
      },
      feed: {
        collections: ['blog', 'portfolio', 'gallery'],
        defaultCollection: 'blog',
        limit: 30,
      },
      manifest: {
        content: { type: 'page' },
        blog: { type: 'page' },
        portfolio: { type: 'page' },
        gallery: { type: 'page' },
        info: { type: 'data' },
      },
    })

    expect(catalog.site.title).toBe('Nuxt Layers Playground')
    expect(catalog.feed.defaultCollection).toBe('blog')
    expect(catalog.feed.limit).toBe(30)
    expect(catalog.feed.collections).toEqual(['blog', 'portfolio', 'gallery'])
    expect(catalog.feed.availableCollections).toEqual(['content', 'blog', 'portfolio', 'gallery'])
    expect(catalog.feed.missingCollections).toEqual([])
    expect(catalog.siteRoutes.map((route) => route.path)).toEqual([
      '/feed',
      '/feed/discovery',
      '/feed/rss',
      '/feed/atom',
      '/feed/json',
    ])
    expect(catalog.collectionGroups).toHaveLength(3)
    expect(catalog.collectionGroups[1]).toMatchObject({
      collection: 'portfolio',
      label: 'Portfolio',
    })
    expect(catalog.collectionGroups[1]?.routes.map((route) => route.path)).toEqual([
      '/feed/portfolio/rss',
      '/feed/portfolio/atom',
      '/feed/portfolio/json',
    ])
  })

  it('surfaces configured collections that do not exist in content', () => {
    const catalog = createFeedCatalog({
      feed: {
        collections: ['blog', 'missing'],
        defaultCollection: 'missing',
      },
      manifest: {
        blog: { type: 'page' },
        gallery: { type: 'page' },
      },
    })

    expect(catalog.feed.missingCollections).toEqual(['missing'])
    expect(catalog.collectionGroups).toHaveLength(1)
    expect(catalog.collectionGroups[0]).toMatchObject({
      collection: 'blog',
      label: 'Blog',
    })
  })
})
