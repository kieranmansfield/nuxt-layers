import type { PreferenceOverride } from '#layers/theme/app/types/theme'
import { createSharedComposable, usePreferredReducedMotion } from '@vueuse/core'

export const useThemeMotion = createSharedComposable(() => {
  const motionOverride = useState<PreferenceOverride>('theme-motion', () => 'system')
  const systemMotion = usePreferredReducedMotion()

  const effectiveReducedMotion = computed(() => {
    if (motionOverride.value === 'on') return true
    if (motionOverride.value === 'off') return false
    return systemMotion.value === 'reduce'
  })

  function setMotionOverride(value: PreferenceOverride) {
    motionOverride.value = value
    if (import.meta.client) {
      localStorage.setItem('theme-motion', value)
    }
  }

  return {
    motionOverride: readonly(motionOverride),
    setMotionOverride,
    effectiveReducedMotion,
    systemMotion,
  }
})
