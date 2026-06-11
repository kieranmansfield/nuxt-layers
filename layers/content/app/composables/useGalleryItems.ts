/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { GalleryQueryOptions } from '../types/content'

export function useGalleryItems(options: GalleryQueryOptions = {}) {
  const { tags, limit } = options

  return useContentData('gallery-items', async () => {
    let items = (await queryCollection('gallery').all()).sort(
      (a, b) => (b.date ?? '').localeCompare(a.date ?? '')
    )

    if (tags?.length) {
      items = items.filter((item) => item.tags?.some((tag: string) => tags.includes(tag)))
    }

    if (limit) {
      items = items.slice(0, limit)
    }

    return items
  })
}
