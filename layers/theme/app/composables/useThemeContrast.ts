import type { PreferenceOverride } from '#layers/theme/app/types/theme'
import { createSharedComposable, usePreferredContrast } from '@vueuse/core'

export const useThemeContrast = createSharedComposable(() => {
  const contrastOverride = useState<PreferenceOverride>('theme-contrast', () => 'system')
  const systemContrast = usePreferredContrast()

  const effectiveHighContrast = computed(() => {
    if (contrastOverride.value === 'on') return true
    if (contrastOverride.value === 'off') return false
    return systemContrast.value === 'more'
  })

  function setContrastOverride(value: PreferenceOverride) {
    contrastOverride.value = value
    if (import.meta.client) {
      localStorage.setItem('theme-contrast', value)
    }
  }

  return {
    contrastOverride: readonly(contrastOverride),
    setContrastOverride,
    effectiveHighContrast,
    systemContrast,
  }
})
