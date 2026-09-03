import type { AccentColor } from './types/theme'

export default defineAppConfig({
  themeLayer: {
    accents: [
      'red',
      'orange',
      'amber',
      'yellow',
      'lime',
      'green',
      'emerald',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ],
    defaultAccent: 'blue',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: AccentColor[]
      defaultAccent?: AccentColor
    }
  }
}
