import type { Collections } from '@nuxt/content'
import type { MaybeRefOrGetter } from 'vue'

type AnyCollectionItem = Collections[keyof Collections]

export type CollectionItemsOptions = CollectionSelection<AnyCollectionItem> & {
  /** Names what `filter` depends on, so a changed filter refetches instead of hitting the cache. */
  filterKey?: string | undefined
}

/**
 * Generic collection list query — sort, filter, limit — shared by
 * `useBlogPosts`, `useGalleryItems`, and `Portfolio/List.vue`'s arbitrary
 * `collection` prop. Single implementation, thin per-domain wrappers.
 */
export function useCollectionItems<K extends keyof Collections>(
  collectionName: K,
  options: MaybeRefOrGetter<CollectionItemsOptions> = {}
) {
  // fallow-ignore-next-line complexity
  const cacheKey = () => {
    const { tags, limit, sortKey, sortDirection = 'desc', filterKey } = toValue(options)
    const tagKey = (tags ?? []).slice().sort().join(',')
    return `${collectionName}-items:${sortKey ?? ''}:${sortDirection}:${tagKey}:${limit ?? ''}:${filterKey ?? ''}`
  }

  return useContentData(cacheKey, async () => {
    const items = (await queryCollection(collectionName).all()).map(
      hoistFrontmatter
    ) as AnyCollectionItem[]

    // Cast back to the specific collection's item type — selectCollection is
    // generic across all collections, but callers always know their own `K`
    // and expect e.g. BlogCollectionItem[], not the union.
    return selectCollection(items, toValue(options)) as unknown as Array<Collections[K]>
  })
}
