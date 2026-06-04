import { createSharedComposable } from '@vueuse/core'
import type { AccentColor } from '#layers/theme/app/types/theme'

export const useAccentColor = createSharedComposable(() => {
  const appConfig = useAppConfig()
  const defaultAccent = (appConfig.themeLayer?.defaultAccent ?? 'blue') as AccentColor

  // useState ensures server value is serialized into the Nuxt payload and reused
  // during hydration, avoiding a mismatch with localStorage (client-only).
  // theme.client.ts reads localStorage after hydration and calls setAccent.
  const accent = useState<AccentColor>('theme-accent', () => defaultAccent)

  const pageAccent = ref<AccentColor | null>(null)
  const activeAccent = computed<AccentColor>(() => pageAccent.value ?? accent.value)

  function setAccent(color: AccentColor) {
    accent.value = color
    if (import.meta.client) {
      localStorage.setItem('theme-colour', color)
    }
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
