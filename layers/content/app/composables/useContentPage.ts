export function useContentPage(path: string) {
  return useAsyncData(`content-page-${path}`, () => queryCollection('content').path(path).first())
}
