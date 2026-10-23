import type { GalleryCollectionItem } from '@nuxt/content'
import { describe, expect, it } from 'vite-plus/test'

import { galleryImageMeta } from './galleryImageMeta'

const gallery = (images: Array<Record<string, string>>) =>
  ({ title: 'Autumn', images }) as unknown as GalleryCollectionItem

describe('galleryImageMeta', () => {
  it("prefers the image's own title and caption", () => {
    const item = gallery([{ src: '/a.jpg', alt: 'Leaf', title: 'Red leaf', caption: 'Oct' }])
    expect(galleryImageMeta(item, 0)).toEqual({
      title: 'Red leaf',
      description: 'Oct',
      ogImage: '/a.jpg',
    })
  })

  it('falls back to alt text, then the gallery title', () => {
    expect(galleryImageMeta(gallery([{ src: '/a.jpg', alt: 'Leaf' }]), 0)).toMatchObject({
      title: 'Leaf',
      description: 'Autumn',
    })
  })

  it('names a missing image by its position', () => {
    expect(galleryImageMeta(gallery([]), 2).title).toBe('Image 3')
    expect(galleryImageMeta(null, 0).title).toBe('Image 1')
  })
})
