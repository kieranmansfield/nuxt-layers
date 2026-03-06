import { defu } from 'defu'
import { ROUTING_PRESETS } from '../types/routing'
import type { RoutingLayerConfig, FeatureValue } from '../types/routing'

export function useRoutingConfig() {
  const appConfig = useAppConfig()
  const user = appConfig.routingLayer as Partial<RoutingLayerConfig>
  const preset = ROUTING_PRESETS[user.preset ?? 'simple']
  const config = defu(user, preset) as RoutingLayerConfig

  return {
    config,
    isStrictMode: () => config.strictDefaultDeny,
    isLayerDefaultDeny: () => config.layerDefaultDeny,
    getFeatureVariant: (name: string): FeatureValue =>
      config.features[name] ?? 'disabled',
    isFeatureEnabled: (name: string) =>
      config.features[name] === 'enabled',
  }
}
