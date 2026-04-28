declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: import('./layouts').GridConfig
      }
    }
  }
}
