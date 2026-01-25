export default defineAppConfig({
  uiLayer: {},
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    uiLayer?: {
      /** Project name */
      name?: string
    }
  }
}
