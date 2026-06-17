import { describe, expect, it, beforeEach, vi } from 'vitest'

import type { H3Event } from 'h3'

const queryCollectionMock = vi.hoisted(() => vi.fn())

vi.mock('@nuxt/content/nitro', () => ({
  queryCollection: queryCollectionMock,
}))

import { getContentFeedItems } from './content-adapter'

describe('getContentFeedItems', () => {
  beforeEach(() => {
    queryCollectionMock.mockReset()
  })

  it('filters drafts, sorts by date, and maps feed items', async () => {
    queryCollectionMock.mockReturnValue({
      all: vi.fn().mockResolvedValue([
        {
          draft: true,
          title: 'Draft post',
          path: '/draft',
          date: '2026-01-04T00:00:00.000Z',
        },
        {
          title: 'Latest post',
          description: 'Newest content',
          path: '/latest',
          date: '2026-01-03T00:00:00.000Z',
          authors: [{ name: 'Ada Lovelace' }],
          tags: ['nuxt'],
        },
        {
          stem: 'Older post',
          _path: '/older',
          createdAt: '2026-01-01T00:00:00.000Z',
          author: { name: 'Grace Hopper' },
        },
      ]),
    })

    const items = await getContentFeedItems({} as H3Event, 'articles', 2)

    expect(queryCollectionMock).toHaveBeenCalledWith({}, 'articles')
    expect(items).toEqual([
      {
        title: 'Latest post',
        description: 'Newest content',
        link: '/latest',
        id: '/latest',
        date: new Date('2026-01-03T00:00:00.000Z'),
        author: 'Ada Lovelace',
        tags: ['nuxt'],
      },
      {
        title: 'Older post',
        description: undefined,
        link: '/older',
        id: '/older',
        date: new Date('2026-01-01T00:00:00.000Z'),
        author: 'Grace Hopper',
        tags: undefined,
      },
    ])
  })
})
