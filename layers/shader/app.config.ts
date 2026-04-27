import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
  shader: {
    preferWebGPU: true,
    maxPixelRatio: 2,
    defaultQuality: 'high',
    debugPanel: true,
    toneMapping: 'aces',
  },
})
