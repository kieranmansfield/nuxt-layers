/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export function useContentPage(path: string) {
  return useContentData(`content-page-${path}`, () => queryCollection('content').path(path).first())
}
