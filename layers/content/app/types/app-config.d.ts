declare module '@nuxt/schema' {
  interface AppConfigInput {
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

export {}
