declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: Array<import('./theme').AccentColor>
      defaultAccent?: import('./theme').AccentColor
    }
  }
}
