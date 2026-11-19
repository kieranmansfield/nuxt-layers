export function useContentPage(path: string) {
  return useContentData(`content-page-${path}`, async () =>
    hoistFrontmatter(await queryCollection('content').path(path).first())
  )
}
