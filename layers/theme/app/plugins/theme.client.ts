export default defineNuxtPlugin(() => {
  // Initialize the shared composable — applies appConfig.ui.colors.primary,
  // cleans up FOUC inline styles, and applies preference classes on <html>.
  useThemePreferences()
})
