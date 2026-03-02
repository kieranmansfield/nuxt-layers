export default defineNuxtPlugin(() => {
  // Initialize shared composables — applies data-theme-colour, data-theme-contrast,
  // data-theme-motion, and data-theme-transparency on <html> on first load.
  useTheme()
})
