import { describe, expect, it } from 'vitest'

import type { FeedConfig, FeedItem } from './types'
import { toAtom } from './formats/atom'
import { toJSONFeed } from './formats/json'
import { toRSS } from './formats/rss'

const config: FeedConfig = {
  title: 'Nuxt Layers Feed',
  description: 'Layered syndication output.',
  siteUrl: 'https://example.com',
  author: {
    name: 'Kieran Mansfield',
    link: 'https://example.com/about',
  },
  favicon: '/favicon.ico',
}

const items: FeedItem[] = [
  {
    title: 'A & B',
    description: 'Read > write',
    link: '/posts/a-b',
    id: '/posts/a-b',
    date: new Date('2026-01-03T10:00:00.000Z'),
    author: 'Ada Lovelace',
    tags: ['nuxt', 'feeds'],
  },
]

describe('feed format serializers', () => {
  it('serializes RSS output with the stylesheet and item data', () => {
    const xml = toRSS(items, config)

    expect(xml).toContain('<?xml-stylesheet type="text/xsl" href="/feed/style.xsl"?>')
    expect(xml).toContain('<title>Nuxt Layers Feed</title>')
    expect(xml).toContain('Ada Lovelace')
    expect(xml).toContain('/posts/a-b')
  })

  it('serializes JSON Feed output as a structured object', () => {
    expect(toJSONFeed(items, config)).toMatchObject({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Nuxt Layers Feed',
      description: 'Layered syndication output.',
      home_page_url: 'https://example.com',
      feed_url: 'https://example.com/feed/json',
      authors: [{ name: 'Kieran Mansfield', url: 'https://example.com/about' }],
      items: [
        {
          id: 'https://example.com/posts/a-b',
          url: 'https://example.com/posts/a-b',
          title: 'A & B',
          content_text: 'Read > write',
          date_published: '2026-01-03T10:00:00.000Z',
          authors: [{ name: 'Ada Lovelace' }],
          tags: ['nuxt', 'feeds'],
        },
      ],
    })
  })

  it('serializes Atom output with escaped markup', () => {
    const xml = toAtom(items, config)

    expect(xml).toContain('<?xml-stylesheet type="text/xsl" href="/feed/style.xsl"?>')
    expect(xml).toContain('<title>Nuxt Layers Feed</title>')
    expect(xml).toContain('<title>A &amp; B</title>')
    expect(xml).toContain('<summary>Read &gt; write</summary>')
  })
})
