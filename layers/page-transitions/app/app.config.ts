export default defineAppConfig({
  pageTransitions: {
    default: 'fade',
    duration: 300,
  },
})

declare module '@nuxt/schema' {
  type AppConfigInput = {
    pageTransitions?: {
      default?: string
      duration?: number
    }
  }
}
