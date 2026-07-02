import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import { useFeatureFlags } from '../../layers/routing/app/composables/useFeatureFlags'
import type { RoutingLayerConfig } from '../../layers/routing/app/types/routing'

type RoutingAppConfig = {
  routingLayer?: Partial<RoutingLayerConfig>
}

var appConfig: RoutingAppConfig = {
  routingLayer: {
    preset: 'product',
    features: {
      beta: 'coming-soon',
      search: 'enabled',
    },
  },
}

mockNuxtImport('useAppConfig', () => () => appConfig)

async function mountFeatureFlags() {
  let resolved: ReturnType<typeof useFeatureFlags> | undefined

  await mountSuspended(
    defineComponent({
      setup() {
        resolved = useFeatureFlags()
        return () => null
      },
    })
  )

  if (!resolved) {
    throw new Error('feature flags composable did not resolve')
  }

  return resolved
}

describe('useFeatureFlags', () => {
  it('falls back to the routing config when no runtime flag is set', async () => {
    const { resolve, runtimeFlags } = await mountFeatureFlags()

    runtimeFlags.value = {}

    expect(resolve('search')).toBe('enabled')
    expect(resolve('beta')).toBe('coming-soon')
    expect(resolve('missing')).toBe('disabled')
  })

  it('prefers runtime flags over the routing config', async () => {
    const { resolve, runtimeFlags } = await mountFeatureFlags()

    runtimeFlags.value = {
      beta: 'enabled',
      alpha: 'disabled',
    }

    expect(resolve('beta')).toBe('enabled')
    expect(resolve('alpha')).toBe('disabled')
  })
})
