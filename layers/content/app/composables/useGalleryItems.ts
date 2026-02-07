import type { GalleryQueryOptions } from '../types/content'

export function useGalleryItems(options: GalleryQueryOptions = {}) {
  const { tags, limit } = options

  return useAsyncData('gallery-items', async () => {
    let items = await queryCollection('gallery').order('date', 'DESC').all()

    if (tags?.length) {
      items = items.filter((item) => item.tags?.some((tag: string) => tags.includes(tag)))
    }

    if (limit) {
      items = items.slice(0, limit)
    }

    return items
  })
}
