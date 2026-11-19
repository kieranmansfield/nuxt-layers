import type { Collections } from '@nuxt/content'

export function useCollectionItem(collection: keyof Collections, slug: string) {
  return useContentData(`${collection}-${slug}`, async () =>
    hoistFrontmatter(await queryCollection(collection).path(`/${collection}/${slug}`).first())
  )
}
