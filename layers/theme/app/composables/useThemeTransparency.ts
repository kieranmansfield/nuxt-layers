import {
  createSharedComposable,
  useLocalStorage,
  usePreferredReducedTransparency,
} from '@vueuse/core'
import type { PreferenceOverride } from '#layers/theme/app/types/theme'

export const useThemeTransparency = createSharedComposable(() => {
  const transparencyOverride = useLocalStorage<PreferenceOverride>('theme-transparency', 'system')
  const systemTransparency = usePreferredReducedTransparency()

  const effectiveReducedTransparency = computed(() => {
    if (transparencyOverride.value === 'on') return true
    if (transparencyOverride.value === 'off') return false
    return systemTransparency.value === 'reduce'
  })

  function setTransparencyOverride(value: PreferenceOverride) {
    transparencyOverride.value = value
  }

  if (import.meta.client) {
    watch(
      effectiveReducedTransparency,
      (reduced) => {
        document.documentElement.setAttribute(
          'data-theme-transparency',
          reduced ? 'reduced' : 'full'
        )
      },
      { immediate: true }
    )
  }

  return {
    transparencyOverride: readonly(transparencyOverride),
    setTransparencyOverride,
    effectiveReducedTransparency,
    systemTransparency,
  }
})
