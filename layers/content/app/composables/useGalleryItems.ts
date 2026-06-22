import type { GalleryQueryOptions } from '../types/content'

export function useGalleryItems(options: GalleryQueryOptions = {}) {
  const { tags, limit } = options
  const key = `gallery-items:${(tags ?? []).slice().sort().join(',')}:${limit ?? ''}`

  return useContentData(key, async () => {
    let items = (await queryCollection('gallery').all())
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

    if (tags?.length) {
      items = items.filter((item) => Boolean(item.tags?.some((tag: string) => tags.includes(tag))))
    }

    if (limit !== undefined) {
      items = items.slice(0, limit)
    }

    return items
  })
}
