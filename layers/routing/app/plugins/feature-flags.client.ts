import type { FeatureValue } from '../types/routing'

export default defineNuxtPlugin(async () => {
  const { config } = useRoutingConfig()
  if (!config.runtimeFlags) return

  const { runtimeFlags } = useFeatures()
  try {
    const data = await $fetch<Record<string, FeatureValue>>('/api/feature-flags')
    runtimeFlags.value = data
  }
  catch (e) {
    if (config.debug) console.warn('[routing] Failed to fetch feature flags', e)
  }
})
