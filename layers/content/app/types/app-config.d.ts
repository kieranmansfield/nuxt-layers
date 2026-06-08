declare module '@nuxt/schema' {
  type AppConfigInput = {
    contentLayer?: {
      name?: string
      sections?: {
        blog?: boolean
        portfolio?: boolean
        gallery?: boolean
      }
    }
  }
}
