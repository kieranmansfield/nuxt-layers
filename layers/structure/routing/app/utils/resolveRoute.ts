import type { FeatureValue, RouteResolution, RoutingLayerConfig } from '../types/routing'

type RouteMeta = {
  feature?: string
  __fromLayer?: boolean
}

function shouldDenyStrict(meta: RouteMeta, config: RoutingLayerConfig): boolean {
  return config.strictDefaultDeny && !meta.feature
}

function shouldDenyLayer(meta: RouteMeta, config: RoutingLayerConfig): boolean {
  return config.layerDefaultDeny && meta.__fromLayer === true && !meta.feature
}

function resolveFeatureOutcome(variant: FeatureValue, config: RoutingLayerConfig): RouteResolution {
  if (variant === 'disabled') return { outcome: 'deny' }
  if (variant === 'beta' || variant === 'coming-soon') {
    return { outcome: 'redirect', to: config.betaRedirect }
  }
  return { outcome: 'allow' }
}

export function resolveRoute(
  meta: RouteMeta,
  config: RoutingLayerConfig,
  resolveFeature: (name: string) => FeatureValue
): RouteResolution {
  if (shouldDenyStrict(meta, config)) {
    return { outcome: 'deny' }
  }

  if (shouldDenyLayer(meta, config)) {
    return { outcome: 'deny' }
  }

  if (!meta.feature) return { outcome: 'allow' }

  return resolveFeatureOutcome(resolveFeature(meta.feature), config)
}
