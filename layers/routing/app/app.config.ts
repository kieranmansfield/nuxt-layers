import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
  routingLayer: {
    preset: 'simple',
    strictDefaultDeny: false,
    layerDefaultDeny: false,
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: false, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
    features: {},
  },
})
