export type FeatureValue = 'enabled' | 'disabled' | 'beta' | 'coming-soon'
export type RoutingPreset = 'simple' | 'marketing' | 'product' | 'enterprise'

export interface RoutingLayerConfig {
  preset: RoutingPreset
  strictDefaultDeny: boolean
  layerDefaultDeny: boolean
  runtimeFlags: boolean
  debug: boolean
  maintenance: { enabled: boolean; allowRoutes: string[] }
  scrollRouting: { enabled: boolean; mode: 'replace' | 'push' }
  features: Record<string, FeatureValue>
}

export const ROUTING_PRESETS: Record<RoutingPreset, Omit<RoutingLayerConfig, 'preset' | 'features'>> = {
  simple: {
    strictDefaultDeny: false,
    layerDefaultDeny: false,
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: false, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
  marketing: {
    strictDefaultDeny: false,
    layerDefaultDeny: true,
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: true, mode: 'replace' },
  },
  product: {
    strictDefaultDeny: false,
    layerDefaultDeny: true,
    runtimeFlags: true,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
  enterprise: {
    strictDefaultDeny: true,
    layerDefaultDeny: true,
    runtimeFlags: true,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
}
