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
    // Browser-chrome colour (<meta name="theme-color">), kept on the page background. Off by
    // default: since Safari 26 only installed web apps and Chrome on Android use it
    themeColor: {
      enabled: false,
      // CSS variable holding the page background
      cssVar: '--ui-bg',
      // Server-rendered colour per OS scheme, until the client reads cssVar - match your
      // light/dark backgrounds to avoid a flash
      light: '#ffffff',
      dark: '#171717',
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    themeLayer?: {
      accents?: AccentColor[]
      defaultAccent?: AccentColor
      themeColor?: {
        enabled?: boolean
        cssVar?: string
        light?: string
        dark?: string
      }
    }
  }
}
