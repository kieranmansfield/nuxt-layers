import type { GalleryQueryOptions } from '../types/content'

export function useGalleryItems(options: GalleryQueryOptions = {}) {
  const { tags, limit } = options

  return useCollectionItems('gallery', { tags, limit, sortKey: 'date', sortDirection: 'desc' })
}
