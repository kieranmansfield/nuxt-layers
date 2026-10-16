import type { AccentColor, PreferenceOverride } from '#layers/theming/app/types/theme'

export default defineNuxtPlugin({
  name: 'theme:theme',
  // fallow-ignore-next-line complexity
  setup() {
    const { setAccent, activeAccent } = useAccentColor()
    const { setContrastOverride, effectiveHighContrast } = useThemeContrast()
    const { setMotionOverride, effectiveReducedMotion } = useThemeMotion()
    const { setTransparencyOverride, effectiveReducedTransparency } = useThemeTransparency()

    // Restore persisted preferences. useState defaults were serialized from the
    // server, so hydration matches only if client state is still at those defaults
    // while hydrating. Plugin setup runs BEFORE hydration, so the stored values are
    // applied on `app:mounted` (after hydration) instead of here.
    useNuxtApp().hook('app:mounted', () => {
      const restorers: Array<[key: string, apply: (value: string) => void]> = [
        ['theme-colour', (v) => setAccent(v as AccentColor)],
        ['theme-contrast', (v) => setContrastOverride(v as PreferenceOverride)],
        ['theme-motion', (v) => setMotionOverride(v as PreferenceOverride)],
        ['theme-transparency', (v) => setTransparencyOverride(v as PreferenceOverride)],
      ]
      for (const [key, apply] of restorers) {
        const stored = localStorage.getItem(key)
        if (stored) apply(stored)
      }
    })

    watch(
      activeAccent,
      (color) => {
        document.documentElement.setAttribute('data-theme-colour', color)
      },
      { immediate: true }
    )

    watch(
      effectiveHighContrast,
      (high) => {
        document.documentElement.setAttribute('data-theme-contrast', high ? 'high' : 'standard')
      },
      { immediate: true }
    )

    watch(
      effectiveReducedMotion,
      (reduced) => {
        document.documentElement.setAttribute('data-theme-motion', reduced ? 'reduced' : 'full')
      },
      { immediate: true }
    )

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
  },
})
