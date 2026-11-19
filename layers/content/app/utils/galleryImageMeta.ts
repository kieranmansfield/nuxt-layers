import type { GalleryCollectionItem } from '@nuxt/content'

/** Page meta for one image of a gallery: its own title/caption, falling back to the gallery's. */
export function galleryImageMeta(item: GalleryCollectionItem | null | undefined, index: number) {
  const image = item?.images?.[index]
  return {
    title: image?.title || image?.alt || `Image ${index + 1}`,
    description: image?.caption || item?.title,
    ogImage: image?.src,
  }
}
