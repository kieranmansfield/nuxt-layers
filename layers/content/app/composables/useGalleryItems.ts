import type { MaybeRefOrGetter } from 'vue'

import type { GalleryQueryOptions } from '../types/content'

export function useGalleryItems(options: MaybeRefOrGetter<GalleryQueryOptions> = {}) {
  return useCollectionItems('gallery', () => {
    const { tags, limit } = toValue(options)
    return { tags, limit, sortKey: 'date', sortDirection: 'desc' }
  })
}
