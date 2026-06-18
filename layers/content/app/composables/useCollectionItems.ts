import type { Collections } from '@nuxt/content'

type CollectionItem<TCollection extends keyof Collections> = Collections[TCollection]

export function useCollectionItems<TCollection extends keyof Collections>(args: {
  key: string
  collection: TCollection
  sort: (a: CollectionItem<TCollection>, b: CollectionItem<TCollection>) => number
  options?: { limit?: number | undefined }
  filter?: (item: CollectionItem<TCollection>) => boolean
}) {
  const { key, collection, sort, options = {}, filter } = args

  return useContentData(key, async () => {
    let items = (await queryCollection(collection).all()) as CollectionItem<TCollection>[]
    items = items.sort(sort)

    if (filter) {
      items = items.filter(filter)
    }

    if (options.limit !== undefined) {
      items = items.slice(0, options.limit)
    }

    return items
  })
}
