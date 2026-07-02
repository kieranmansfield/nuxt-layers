import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import { useMaintenance } from '../../layers/routing/app/composables/useMaintenance'
import { useRoutingConfig } from '../../layers/routing/app/composables/useRoutingConfig'
import type { RoutingLayerConfig } from '../../layers/routing/app/types/routing'

type RoutingAppConfig = {
  routingLayer?: Partial<RoutingLayerConfig>
}

var appConfig: RoutingAppConfig = {
  routingLayer: {
    preset: 'enterprise',
    features: {
      alpha: 'enabled',
      beta: 'coming-soon',
    },
  },
}

mockNuxtImport('useAppConfig', () => () => appConfig)

async function mountComposable<T>(composable: () => T) {
  let resolved: T | undefined

  await mountSuspended(
    defineComponent({
      setup() {
        resolved = composable()
        return () => null
      },
    })
  )

  if (!resolved) {
    throw new Error('composable did not resolve')
  }

  return resolved
}

describe('useRoutingConfig', () => {
  it('merges the selected preset with app config overrides', async () => {
    const resolved = await mountComposable(useRoutingConfig)

    expect(resolved.config.preset).toBe('enterprise')
    expect(resolved.config.strictDefaultDeny).toBe(true)
    expect(resolved.config.layerDefaultDeny).toBe(true)
    expect(resolved.config.maintenance.enabled).toBe(true)
    expect(resolved.config.maintenance.allowRoutes).toEqual(['/maintenance'])
    expect(resolved.config.scrollRouting.mode).toBe('replace')
    expect(resolved.isStrictMode()).toBe(true)
    expect(resolved.isLayerDefaultDeny()).toBe(true)
    expect(resolved.getFeatureVariant('alpha')).toBe('enabled')
    expect(resolved.isFeatureEnabled('alpha')).toBe(true)
    expect(resolved.getFeatureVariant('missing')).toBe('disabled')
  })

  it('feeds maintenance state through the helper composable', async () => {
    const resolved = await mountComposable(useMaintenance)

    expect(resolved.isEnabled.value).toBe(true)
    expect(resolved.allowRoutes.value).toEqual(['/maintenance'])
  })
})
