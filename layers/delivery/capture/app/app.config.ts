export default defineAppConfig({
  captureLayer: {
    enabled: true,
    hide: [] as string[],
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    captureLayer?: {
      /** Set false to ignore capture runs entirely. Default: true */
      enabled?: boolean
      /** Selectors hidden while kmcom-capture is taking screenshots (chat widgets, banners…) */
      hide?: string[]
    }
  }
}
