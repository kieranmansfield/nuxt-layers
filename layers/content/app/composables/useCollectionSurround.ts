import type { PageCollections } from '@nuxt/content'

export function useCollectionSurround(collection: keyof PageCollections, slug: string) {
  return useContentData(`${collection}-${slug}-surround`, () =>
    queryCollectionItemSurroundings(collection, `/${collection}/${slug}`)
  )
}
