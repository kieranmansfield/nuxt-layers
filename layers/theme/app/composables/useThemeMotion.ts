import { createSharedComposable, useLocalStorage, usePreferredReducedMotion } from '@vueuse/core'
import type { PreferenceOverride } from '#layers/theme/app/types/theme'

export const useThemeMotion = createSharedComposable(() => {
  const motionOverride = useLocalStorage<PreferenceOverride>('theme-motion', 'system')
  const systemMotion = usePreferredReducedMotion()

  const effectiveReducedMotion = computed(() => {
    if (motionOverride.value === 'on') return true
    if (motionOverride.value === 'off') return false
    return systemMotion.value === 'reduce'
  })

  function setMotionOverride(value: PreferenceOverride) {
    motionOverride.value = value
  }

  if (import.meta.client) {
    watch(effectiveReducedMotion, (reduced) => {
      document.documentElement.setAttribute('data-theme-motion', reduced ? 'reduced' : 'full')
    }, { immediate: true })
  }

  return {
    motionOverride: readonly(motionOverride),
    setMotionOverride,
    effectiveReducedMotion,
    systemMotion,
  }
})
