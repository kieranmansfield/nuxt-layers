/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Collections } from '@nuxt/content'

export function useCollectionItem(collection: string, slug: string) {
  return useContentData(`${collection}-${slug}`, () =>
    queryCollection(collection as keyof Collections)
      .path(`/${collection}/${slug}`)
      .first()
  )
}
