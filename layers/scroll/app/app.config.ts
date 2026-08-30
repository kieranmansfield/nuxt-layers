export default defineAppConfig({
  scroll: {
    smoothScroll: true as boolean | string[],
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    scroll?: {
      smoothScroll?: boolean | string[]
    }
  }
}
