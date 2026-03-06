import type { RoutingLayerConfig } from './types/routing'

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
  } satisfies RoutingLayerConfig,
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    routingLayer?: Partial<import('./types/routing').RoutingLayerConfig>
  }
}
