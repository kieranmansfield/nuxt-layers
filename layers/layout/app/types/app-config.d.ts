import type { GridConfig } from './layouts'

declare module '@nuxt/schema' {
  interface AppConfigInput {
    layoutLayer?: {
      name?: string
      ui?: {
        grid?: GridConfig
      }
    }
  }
}

export {}
