declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: import('./theme').AccentColor[]
      defaultAccent?: import('./theme').AccentColor
    }
  }
}
