import type { FeatureValue, RouteResolution, RoutingLayerConfig } from '../types/routing'

interface RouteMeta {
  feature?: string
  __fromLayer?: boolean
}

export function resolveRoute(
  meta: RouteMeta,
  config: RoutingLayerConfig,
  resolveFeature: (name: string) => FeatureValue,
): RouteResolution {
  if (config.strictDefaultDeny && !meta.feature) {
    return { outcome: 'deny' }
  }

  if (config.layerDefaultDeny && meta.__fromLayer && !meta.feature) {
    return { outcome: 'deny' }
  }

  if (!meta.feature) return { outcome: 'allow' }

  const variant = resolveFeature(meta.feature)

  if (variant === 'disabled') return { outcome: 'deny' }
  if (variant === 'beta' || variant === 'coming-soon') {
    return { outcome: 'redirect', to: config.betaRedirect }
  }

  return { outcome: 'allow' }
}
