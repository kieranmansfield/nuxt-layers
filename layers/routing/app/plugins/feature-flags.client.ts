/* eslint-disable no-restricted-syntax */
import { useFeatureFlags } from '../composables/useFeatureFlags'
import type { FeatureValue } from '../types/routing'

export default defineNuxtPlugin(async () => {
  const { config } = useRoutingConfig()
  if (!config.runtimeFlags) return

  const { runtimeFlags } = useFeatureFlags()
  try {
    const data = await $fetch<Record<string, FeatureValue>>('/api/feature-flags')
    runtimeFlags.value = data
  } catch (e) {
    if (config.debug) console.warn('[routing] Failed to fetch feature flags', e)
  }
})
