export function useCollectionSurround(
  collection: string,
  slug: string,
  fields: string[] = ['description']
) {
  return useContentData(`${collection}-${slug}-surround`, () =>
    queryCollectionItemSurroundings(collection, `/${collection}/${slug}`, { fields })
  )
}
