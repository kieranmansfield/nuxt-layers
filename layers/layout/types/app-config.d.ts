declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: import('../app/types/layouts').GridConfig
      }
    }
  }
}
