import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { AccentColor } from '#layers/theme/app/types/theme'

export const useAccentColor = createSharedComposable(() => {
  const appConfig = useAppConfig()

  const defaultAccent = ((appConfig as any).themeLayer?.defaultAccent ?? 'blue') as AccentColor
  const accent = useLocalStorage<AccentColor>('theme-colour', defaultAccent)

  const pageAccent = ref<AccentColor | null>(null)
  const activeAccent = computed<AccentColor>(() => pageAccent.value ?? accent.value)

  function setAccent(color: AccentColor) {
    accent.value = color
  }

  function setPageAccent(color: AccentColor | null) {
    pageAccent.value = color
  }

  if (import.meta.client) {
    watch(activeAccent, (color) => {
      document.documentElement.setAttribute('data-theme-colour', color)
    }, { immediate: true })
  }

  return {
    accent: readonly(accent),
    setAccent,
    pageAccent: readonly(pageAccent),
    setPageAccent,
    activeAccent,
  }
})
