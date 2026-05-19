import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { AccentColor } from '#layers/theme/app/types/theme'

export const useAccentColor = createSharedComposable(() => {
  const appConfig = useAppConfig()

  const defaultAccent = (appConfig.themeLayer?.defaultAccent ?? 'blue') as AccentColor
  const accent = useLocalStorage<AccentColor>('theme-colour', defaultAccent)

  const pageAccent = ref<AccentColor | null>(null)
  const activeAccent = computed<AccentColor>(() => pageAccent.value ?? accent.value)

  function setAccent(color: AccentColor) {
    accent.value = color
  }

  function setPageAccent(color: AccentColor | null) {
    pageAccent.value = color
  }

  return {
    accent: readonly(accent),
    setAccent,
    pageAccent: readonly(pageAccent),
    setPageAccent,
    activeAccent,
  }
})
