import type { Collections } from '@nuxt/content'

type AnyCollectionItem = Collections[keyof Collections]

export type CollectionItemsOptions = {
  tags?: string[] | undefined
  limit?: number | undefined
  /** Frontmatter field to sort by (e.g. 'date', 'year'). Duck-typed — missing on an item sorts last. */
  sortKey?: string | undefined
  sortDirection?: 'asc' | 'desc' | undefined
  /** Extra domain-specific predicate (e.g. exclude drafts, require featured). */
  filter?: ((item: AnyCollectionItem) => boolean) | undefined
}

function fieldValue(item: AnyCollectionItem, key: string): unknown {
  return key in item ? (item as unknown as Record<string, unknown>)[key] : undefined
}

function itemTags(item: AnyCollectionItem): string[] {
  return 'tags' in item ? ((item.tags as string[] | undefined) ?? []) : []
}

/**
 * Generic collection list query — sort, filter, limit — shared by
 * `useBlogPosts`, `useGalleryItems`, and `Portfolio/List.vue`'s arbitrary
 * `collection` prop. Single implementation, thin per-domain wrappers.
 */
export function useCollectionItems<K extends keyof Collections>(
  collectionName: K,
  options: CollectionItemsOptions = {}
) {
  const { tags, limit, sortKey, sortDirection = 'desc', filter } = options
  const cacheKey = `${collectionName}-items:${sortKey ?? ''}:${(tags ?? []).slice().sort().join(',')}:${limit ?? ''}`

  // fallow-ignore-next-line complexity
  return useContentData(cacheKey, async () => {
    let items = (await queryCollection(collectionName).all()) as AnyCollectionItem[]

    if (sortKey) {
      // fallow-ignore-next-line complexity
      items = items.slice().sort((a, b) => {
        const av = fieldValue(a, sortKey)
        const bv = fieldValue(b, sortKey)
        if (av === bv) return 0
        const cmp = (av ?? '') > (bv ?? '') ? 1 : -1
        return sortDirection === 'desc' ? -cmp : cmp
      })
    }

    if (filter) items = items.filter(filter)

    if (tags?.length) {
      items = items.filter((item) => itemTags(item).some((tag) => tags.includes(tag)))
    }

    if (limit) items = items.slice(0, limit)

    // Cast back to the specific collection's item type — the sort/filter/tag
    // machinery above is generic across all collections, but callers always
    // know their own `K` and expect e.g. BlogCollectionItem[], not the union.
    return items as unknown as Array<Collections[K]>
  })
}
