import { createSharedComposable, useLocalStorage, usePreferredContrast } from '@vueuse/core'
import type { PreferenceOverride } from '#layers/theme/app/types/theme'

export const useThemeContrast = createSharedComposable(() => {
  const contrastOverride = useLocalStorage<PreferenceOverride>('theme-contrast', 'system')
  const systemContrast = usePreferredContrast()

  const effectiveHighContrast = computed(() => {
    if (contrastOverride.value === 'on') return true
    if (contrastOverride.value === 'off') return false
    return systemContrast.value === 'more'
  })

  function setContrastOverride(value: PreferenceOverride) {
    contrastOverride.value = value
  }

  if (import.meta.client) {
    watch(
      effectiveHighContrast,
      (high) => {
        document.documentElement.setAttribute('data-theme-contrast', high ? 'high' : 'standard')
      },
      { immediate: true }
    )
  }

  return {
    contrastOverride: readonly(contrastOverride),
    setContrastOverride,
    effectiveHighContrast,
    systemContrast,
  }
})
