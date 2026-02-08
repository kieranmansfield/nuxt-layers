export default defineAppConfig({
  shader: {
    preferWebGPU: true,
    maxPixelRatio: 2,
    defaultQuality: 'high' as 'low' | 'medium' | 'high' | 'ultra',
    debugPanel: true,
    toneMapping: 'aces' as 'aces' | 'reinhard' | 'cineon' | 'linear',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    shaderLayer?: {
      /** Project name */
      name?: string
    }
  }
}
