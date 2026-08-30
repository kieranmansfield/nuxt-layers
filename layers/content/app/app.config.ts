import type { ContentLayerConfig } from './types/content'

export default defineAppConfig({
  contentLayer: {
    sections: {
      blog: true,
      portfolio: true,
      gallery: true,
    },
  } satisfies ContentLayerConfig,
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    contentLayer?: ContentLayerConfig
  }
}
