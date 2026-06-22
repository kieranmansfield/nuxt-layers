import { queryCollection } from '@nuxt/content/nitro'
import type { H3Event } from 'h3'

import type { FeedItem } from './types'
import { resolveFeedAuthor, resolveFeedDate } from './feed-author'

type FeedSourceAuthor = {
  name?: string | undefined
}

type FeedSourceItem = {
  draft?: boolean | undefined
  title?: string | undefined
  description?: string | undefined
  stem?: string | undefined
  path?: string | undefined
  _path?: string | undefined
  date?: string | number | Date | undefined
  createdAt?: string | number | Date | undefined
  author?: FeedSourceAuthor | string | undefined
  authors?: FeedSourceAuthor[] | undefined
  tags?: string[] | undefined
}

type FeedCollectionQuery = {
  all: () => Promise<FeedSourceItem[]>
}

const COLLECTION_NAME_RE = /^[a-z][a-z0-9_-]*$/i

const getFeedCollection = queryCollection as unknown as (
  event: H3Event,
  collection: string
) => FeedCollectionQuery

export async function getContentFeedItems(
  event: H3Event,
  collection: string = 'blog',
  limit: number = 30
): Promise<FeedItem[]> {
  if (!COLLECTION_NAME_RE.test(collection)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid collection name' })
  }

  // queryCollection is keyed by literal collection names, but feed routes accept
  // a runtime collection string; keep the unsafe bridge local here.
  const raw = await getFeedCollection(event, collection).all()

  return raw
    .filter((item) => !item.draft)
    .sort((a, b) => resolveFeedDate(b).getTime() - resolveFeedDate(a).getTime())
    .slice(0, limit)
    .map((item): FeedItem => {
      const link = item.path ?? item._path ?? ''
      return {
        title: item.title ?? item.stem ?? '',
        description: item.description,
        link,
        id: link,
        date: resolveFeedDate(item),
        author: resolveFeedAuthor(item),
        tags: item.tags,
      }
    })
}
