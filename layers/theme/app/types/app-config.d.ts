declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: string[]
      defaultAccent?: string
    }
  }
}
