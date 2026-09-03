import { describe, expect, it } from 'vitest'

import type { FeatureValue, RouteResolution, RoutingLayerConfig } from '../types/routing'
import { resolveRoute } from './resolveRoute'

function createConfig(overrides: Partial<RoutingLayerConfig> = {}): RoutingLayerConfig {
  return {
    preset: 'marketing',
    strictDefaultDeny: false,
    layerDefaultDeny: false,
    betaRedirect: '/coming-soon',
    runtimeFlags: false,
    debug: false,
    maintenance: { enabled: false, allowRoutes: ['/maintenance'] },
    scrollRouting: { enabled: false, mode: 'replace' },
    features: {},
    ...overrides,
  }
}

describe('resolveRoute', () => {
  it('allows routes without a feature by default', () => {
    expect(resolveRoute({}, createConfig(), () => 'enabled')).toEqual({ outcome: 'allow' })
  })

  it('denies routes when strict default deny is enabled', () => {
    expect(resolveRoute({}, createConfig({ strictDefaultDeny: true }), () => 'enabled')).toEqual({
      outcome: 'deny',
    })
  })

  it('denies layer-owned routes without a feature when layer default deny is enabled', () => {
    expect(
      resolveRoute({ __fromLayer: true }, createConfig({ layerDefaultDeny: true }), () => 'enabled')
    ).toEqual({ outcome: 'deny' })
  })

  const featureCases: Array<[FeatureValue, RouteResolution]> = [
    ['disabled', { outcome: 'deny' }],
    ['beta', { outcome: 'redirect', to: '/coming-soon' }],
    ['coming-soon', { outcome: 'redirect', to: '/coming-soon' }],
  ]

  it.each(featureCases)('handles %s feature variants', (variant, expected) => {
    expect(resolveRoute({ feature: 'feature-x' }, createConfig(), () => variant)).toEqual(expected)
  })
})
