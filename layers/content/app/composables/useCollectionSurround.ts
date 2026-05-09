import type { PageCollections } from '@nuxt/content'

export function useCollectionSurround(collection: string, slug: string) {
  return useContentData(`${collection}-${slug}-surround`, () =>
    queryCollectionItemSurroundings(collection as keyof PageCollections, `/${collection}/${slug}`)
  )
}
