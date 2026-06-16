import { queryCollection } from '@nuxt/content/nitro'
import type { H3Event } from 'h3'

import type { FeedItem } from './types'

type AnyContent = Record<string, unknown>

export async function getContentFeedItems(
  event: H3Event,
  collection: string = 'blog',
  limit: number = 30
): Promise<FeedItem[]> {
  // queryCollection's first argument is typed as a const collection name, but we pass
  // a dynamic string at runtime — the cast is intentional and safe here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: AnyContent[] = await (queryCollection as any)(event, collection).all()

  return raw
    .filter((item) => !item.draft)
    .sort(
      (a, b) =>
        new Date(b.date ?? b.createdAt ?? 0).getTime() -
        new Date(a.date ?? a.createdAt ?? 0).getTime()
    )
    .slice(0, limit)
    .map((item) => {
      const firstAuthor = Array.isArray(item.authors)
        ? item.authors[0]?.name
        : (item.author?.name ?? (typeof item.author === 'string' ? item.author : undefined))
      return {
        title: item.title ?? item.stem ?? '',
        description: item.description,
        link: item.path ?? item._path ?? '',
        id: item.path ?? item._path ?? '',
        date: new Date(item.date ?? item.createdAt ?? Date.now()),
        author: firstAuthor ?? undefined,
        tags: Array.isArray(item.tags) ? item.tags : undefined,
      }
    })
}
