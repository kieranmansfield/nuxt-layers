/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module '@nuxt/schema' {
  type AppConfigInput = {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: import('./layouts').GridConfig
      }
    }
  }
}
