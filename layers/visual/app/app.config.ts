import type { GradientConfig } from './types/gradient'
import type { AccentSceneConfig } from './types/accent'

export default defineAppConfig({
  uiLayer: {
    gradients: {
      brand: {
        shape: 'linear' as const,
        direction: 'to-br' as const,
        from: { color: 'primary' as const, shade: 500 as const },
        to: { color: 'secondary' as const, shade: 600 as const },
      },
      subtle: {
        shape: 'linear' as const,
        direction: 'to-b' as const,
        from: { color: 'primary' as const, shade: 100 as const, opacity: 50 },
        to: { color: 'transparent' as const },
      },
      hero: {
        shape: 'radial' as const,
        from: { color: 'primary' as const, shade: 400 as const, opacity: 40 },
        to: { color: 'transparent' as const },
      },
    },
    accentScenes: {
      hero: {
        blobs: [
          {
            x: 20,
            y: 30,
            size: '50rem',
            blur: '3xl' as const,
            opacity: 25,
            color: 'primary' as const,
            shade: 400 as const,
          },
          {
            x: 80,
            y: 70,
            size: '40rem',
            blur: '3xl' as const,
            opacity: 20,
            color: 'secondary' as const,
            shade: 500 as const,
          },
        ],
      },
      corner: {
        blobs: [
          {
            x: 100,
            y: 0,
            size: '35rem',
            blur: '2xl' as const,
            opacity: 30,
            color: 'primary' as const,
            shade: 500 as const,
          },
        ],
      },
      scattered: {
        blobs: [
          {
            x: 15,
            y: 20,
            size: '30rem',
            blur: 'xl' as const,
            opacity: 20,
            color: 'primary' as const,
            shade: 400 as const,
          },
          {
            x: 85,
            y: 30,
            size: '25rem',
            blur: 'xl' as const,
            opacity: 15,
            color: 'secondary' as const,
            shade: 400 as const,
          },
          {
            x: 50,
            y: 80,
            size: '35rem',
            blur: '2xl' as const,
            opacity: 18,
            color: 'info' as const,
            shade: 400 as const,
          },
        ],
      },
      minimal: {
        blobs: [
          {
            x: 50,
            y: 50,
            size: '60rem',
            blur: '3xl' as const,
            opacity: 10,
            color: 'primary' as const,
            shade: 500 as const,
          },
        ],
      },
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    uiLayer?: {
      name?: string
      gradients?: Record<string, GradientConfig>
      accentScenes?: Record<string, AccentSceneConfig>
    }
  }
}
