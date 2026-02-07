export function useBlogPost(slug: string) {
  return useCollectionItem('blog', slug)
}
