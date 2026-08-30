export default defineAppConfig({})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    layers?: Record<string, boolean>
  }
  interface AppConfig {
    layers?: Record<string, boolean>
  }
}
