export default defineAppConfig({
  contentLayer: {},
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    contentLayer?: {
      /** Project name */
      name?: string
    }
  }
}
