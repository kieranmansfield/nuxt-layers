import type { AccentColor } from './theme'

declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: AccentColor[]
      defaultAccent?: AccentColor
    }
  }
}
