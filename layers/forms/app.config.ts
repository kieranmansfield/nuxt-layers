export default defineAppConfig({
  formsLayer: {},
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    formsLayer?: {
      /** Project name */
      name?: string
    }
  }
}
