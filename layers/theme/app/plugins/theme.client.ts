export default defineNuxtPlugin(() => {
  const { activeAccent } = useAccentColor()
  const { effectiveHighContrast } = useThemeContrast()
  const { effectiveReducedMotion } = useThemeMotion()
  const { effectiveReducedTransparency } = useThemeTransparency()

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
