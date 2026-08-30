export default defineAppConfig({
  shader: {
    preferWebGPU: true,
    maxPixelRatio: 2,
    defaultQuality: 'high',
    debugPanel: true,
    toneMapping: 'aces',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    shader?: {
      preferWebGPU?: boolean
      maxPixelRatio?: number
      defaultQuality?: 'low' | 'medium' | 'high' | 'ultra'
      debugPanel?: boolean
      toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    }
  }
}
