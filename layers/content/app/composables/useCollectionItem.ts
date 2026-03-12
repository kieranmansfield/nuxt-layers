export function useCollectionItem(collection: string, slug: string) {
  return useContentData(`${collection}-${slug}`, () =>
    queryCollection(collection).path(`/${collection}/${slug}`).first()
  )
}
