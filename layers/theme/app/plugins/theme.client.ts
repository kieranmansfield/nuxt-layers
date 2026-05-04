export default defineNuxtPlugin(() => {
  const config = useAppConfig()
  if ((config.layers as Record<string, boolean> | undefined)?.theme === false) return

  // Initialize shared composables — applies data-theme-colour, data-theme-contrast,
  // data-theme-motion, and data-theme-transparency on <html> on first load.
  useTheme()
})
