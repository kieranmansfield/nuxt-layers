import type { FeatureValue } from '../types/routing'
import { useFeatureFlags } from '../composables/useFeatureFlags'

export default defineNuxtPlugin(async () => {
  const { config } = useRoutingConfig()
  if (!config.runtimeFlags) return

  const { runtimeFlags } = useFeatureFlags()
  try {
    const data = await $fetch<Record<string, FeatureValue>>('/api/feature-flags')
    runtimeFlags.value = data
  }
  catch (e) {
    if (config.debug) console.warn('[routing] Failed to fetch feature flags', e)
  }
})
