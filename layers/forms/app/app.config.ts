export default defineAppConfig({
  formsLayer: {},
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    formsLayer?: {
      name?: string
    }
  }
}
