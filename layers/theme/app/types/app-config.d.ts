/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module '@nuxt/schema' {
  type AppConfigInput = {
    themeLayer?: {
      accents?: Array<import('./theme').AccentColor>
      defaultAccent?: import('./theme').AccentColor
    }
  }
}
