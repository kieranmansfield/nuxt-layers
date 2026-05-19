export type FeatureValue = 'enabled' | 'disabled' | 'beta' | 'coming-soon'
export type RoutingPreset = 'simple' | 'marketing' | 'product' | 'enterprise'

export type RouteResolution =
  | { outcome: 'allow' }
  | { outcome: 'deny' }
  | { outcome: 'redirect'; to: string }

export interface RoutingLayerConfig {
  preset: RoutingPreset
  strictDefaultDeny: boolean
  layerDefaultDeny: boolean
  betaRedirect: string
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
    betaRedirect: '/coming-soon',
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: false, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
  marketing: {
    strictDefaultDeny: false,
    layerDefaultDeny: true,
    betaRedirect: '/coming-soon',
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: true, mode: 'replace' },
  },
  product: {
    strictDefaultDeny: false,
    layerDefaultDeny: true,
    betaRedirect: '/coming-soon',
    runtimeFlags: true,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
  enterprise: {
    strictDefaultDeny: true,
    layerDefaultDeny: true,
    betaRedirect: '/coming-soon',
    runtimeFlags: true,
    debug: false,
    maintenance: { enabled: true, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
  },
}
