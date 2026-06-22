import type { GalleryQueryOptions } from '../types/content'
import { useCollectionItems } from './useCollectionItems'

export function useGalleryItems(options: GalleryQueryOptions = {}) {
  const { tags, limit } = options

  const key = `gallery-items:${(tags ?? []).slice().sort().join(',')}:${limit ?? ''}`
  return useCollectionItems({
    key,
    collection: 'gallery',
    sort: (a, b) => (b.date ?? '').localeCompare(a.date ?? ''),
    options: { limit },
    filter: (item) =>
      !tags?.length || Boolean(item.tags?.some((tag: string) => tags.includes(tag))),
  })
}
