export function useContentPage(path: string) {
  return useContentData(`content-page-${path}`, () => queryCollection('content').path(path).first())
}
