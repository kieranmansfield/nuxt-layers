export function useCollectionItem(collection: string, slug: string) {
  return useAsyncData(`${collection}-${slug}`, () =>
    queryCollection(collection).path(`/${collection}/${slug}`).first()
  )
}
