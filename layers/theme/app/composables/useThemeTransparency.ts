import type { PreferenceOverride } from '#layers/theme/app/types/theme'
import { createSharedComposable, usePreferredReducedTransparency } from '@vueuse/core'

export const useThemeTransparency = createSharedComposable(() => {
  const transparencyOverride = useState<PreferenceOverride>('theme-transparency', () => 'system')
  const systemTransparency = usePreferredReducedTransparency()

  const effectiveReducedTransparency = computed(() => {
    if (transparencyOverride.value === 'on') return true
    if (transparencyOverride.value === 'off') return false
    return systemTransparency.value === 'reduce'
  })

  function setTransparencyOverride(value: PreferenceOverride) {
    transparencyOverride.value = value
    if (import.meta.client) {
      localStorage.setItem('theme-transparency', value)
    }
  }

  return {
    transparencyOverride: readonly(transparencyOverride),
    setTransparencyOverride,
    effectiveReducedTransparency,
    systemTransparency,
  }
})
