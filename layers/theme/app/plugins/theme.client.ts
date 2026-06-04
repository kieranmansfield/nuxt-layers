import type { AccentColor, PreferenceOverride } from '#layers/theme/app/types/theme'

export default defineNuxtPlugin(() => {
  const { setAccent, activeAccent } = useAccentColor()
  const { setContrastOverride, effectiveHighContrast } = useThemeContrast()
  const { setMotionOverride, effectiveReducedMotion } = useThemeMotion()
  const { setTransparencyOverride, effectiveReducedTransparency } = useThemeTransparency()

  // Restore persisted preferences. useState defaults were serialized from the
  // server, so hydration matches. We update to the stored values here, after
  // hydration completes, to avoid any mismatch.
  const storedAccent = localStorage.getItem('theme-colour')
  if (storedAccent) setAccent(storedAccent as AccentColor)

  const storedContrast = localStorage.getItem('theme-contrast')
  if (storedContrast) setContrastOverride(storedContrast as PreferenceOverride)

  const storedMotion = localStorage.getItem('theme-motion')
  if (storedMotion) setMotionOverride(storedMotion as PreferenceOverride)

  const storedTransparency = localStorage.getItem('theme-transparency')
  if (storedTransparency) setTransparencyOverride(storedTransparency as PreferenceOverride)

  watch(activeAccent, (color) => {
    document.documentElement.setAttribute('data-theme-colour', color)
  }, { immediate: true })

  watch(effectiveHighContrast, (high) => {
    document.documentElement.setAttribute('data-theme-contrast', high ? 'high' : 'standard')
  }, { immediate: true })

  watch(effectiveReducedMotion, (reduced) => {
    document.documentElement.setAttribute('data-theme-motion', reduced ? 'reduced' : 'full')
  }, { immediate: true })

  watch(effectiveReducedTransparency, (reduced) => {
    document.documentElement.setAttribute('data-theme-transparency', reduced ? 'reduced' : 'full')
  }, { immediate: true })
})
