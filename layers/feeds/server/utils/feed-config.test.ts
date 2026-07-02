import { describe, expect, it } from 'vitest'

import {
  createFeedConfig,
  resolveFeedCollection,
  resolveFeedLimit,
  resolveFeedSiteConfig,
} from './feed-config'

describe('resolveFeedSiteConfig', () => {
  it('defaults site to an empty object when appConfig.site is missing', () => {
    const result = resolveFeedSiteConfig({}, new URL('https://example.com/feed'))
    expect(result.site).toEqual({})
  })

  it('strips a trailing slash from a configured site url', () => {
    const result = resolveFeedSiteConfig(
      { site: { url: 'https://example.com/' } },
      new URL('https://request-origin.com/feed')
    )
    expect(result.siteUrl).toBe('https://example.com')
  })

  it('keeps a site url without a trailing slash unchanged', () => {
    const result = resolveFeedSiteConfig(
      { site: { url: 'https://example.com' } },
      new URL('https://request-origin.com/feed')
    )
    expect(result.siteUrl).toBe('https://example.com')
  })

  it('falls back to the request origin when no site url is configured', () => {
    const result = resolveFeedSiteConfig({}, new URL('https://request-origin.com/feed?x=1'))
    expect(result.siteUrl).toBe('https://request-origin.com')
  })
})

describe('resolveFeedCollection', () => {
  it('uses the explicit collection argument when provided', () => {
    expect(resolveFeedCollection({ defaultCollection: 'docs' }, 'blog')).toBe('blog')
  })

  it('falls back to the configured default collection', () => {
    expect(resolveFeedCollection({ defaultCollection: 'docs' }, undefined)).toBe('docs')
  })

  it('falls back to "blog" when neither is provided', () => {
    expect(resolveFeedCollection(undefined, undefined)).toBe('blog')
  })
})

describe('createFeedConfig', () => {
  it('uses "My Site" as the title fallback with no collection label', () => {
    const config = createFeedConfig({ site: {}, siteUrl: 'https://example.com', collection: undefined })
    expect(config.title).toBe('My Site')
  })

  it('appends a capitalized collection label to the title', () => {
    const config = createFeedConfig({
      site: { title: 'Nuxt Layers' },
      siteUrl: 'https://example.com',
      collection: 'blog',
    })
    expect(config.title).toBe('Nuxt Layers — Blog')
  })

  it('defaults description to an empty string', () => {
    const config = createFeedConfig({ site: {}, siteUrl: 'https://example.com', collection: undefined })
    expect(config.description).toBe('')
  })

  it('passes description through when set', () => {
    const config = createFeedConfig({
      site: { description: 'A monorepo of Nuxt layers' },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.description).toBe('A monorepo of Nuxt layers')
  })

  it('builds an author object when the site has a named author', () => {
    const config = createFeedConfig({
      site: { author: { name: 'Kieran Mansfield', email: 'hi@example.com', link: 'https://example.com' } },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.author).toEqual({
      name: 'Kieran Mansfield',
      email: 'hi@example.com',
      link: 'https://example.com',
    })
  })

  it('omits author when the site author has no name', () => {
    const config = createFeedConfig({ site: {}, siteUrl: 'https://example.com', collection: undefined })
    expect(config.author).toBeUndefined()
  })

  it('maps a falsy site.image to undefined', () => {
    const config = createFeedConfig({
      site: { image: '' },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.image).toBeUndefined()
  })

  it('passes through a truthy site.image', () => {
    const config = createFeedConfig({
      site: { image: 'https://example.com/og.png' },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.image).toBe('https://example.com/og.png')
  })

  it('defaults favicon to /favicon.ico', () => {
    const config = createFeedConfig({ site: {}, siteUrl: 'https://example.com', collection: undefined })
    expect(config.favicon).toBe('/favicon.ico')
  })

  it('prefers an explicit copyright over a generated one', () => {
    const config = createFeedConfig({
      site: { copyright: 'All rights reserved', author: { name: 'Kieran Mansfield' } },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.copyright).toBe('All rights reserved')
  })

  it('generates a copyright string from the author name and current year', () => {
    const config = createFeedConfig({
      site: { author: { name: 'Kieran Mansfield' } },
      siteUrl: 'https://example.com',
      collection: undefined,
    })
    expect(config.copyright).toBe(`Copyright ${new Date().getFullYear()} Kieran Mansfield`)
  })

  it('omits copyright when there is no explicit copyright and no author name', () => {
    const config = createFeedConfig({ site: {}, siteUrl: 'https://example.com', collection: undefined })
    expect(config.copyright).toBeUndefined()
  })
})

describe('resolveFeedLimit', () => {
  it('defaults to 30 when no limit is configured', () => {
    expect(resolveFeedLimit(undefined)).toBe(30)
  })

  it('uses the configured limit', () => {
    expect(resolveFeedLimit({ limit: 10 })).toBe(10)
  })

  it('returns Infinity when unlimited is requested, ignoring the configured limit', () => {
    expect(resolveFeedLimit({ limit: 10 }, { unlimited: true })).toBe(Infinity)
  })

  it('returns the default limit when unlimited is explicitly false', () => {
    expect(resolveFeedLimit(undefined, { unlimited: false })).toBe(30)
  })
})
