/**
 * Unified theme facade.
 *
 * Composes useAccentColor, useThemeContrast, useThemeMotion, and
 * useThemeTransparency. Each sub-composable is individually shared via
 * createSharedComposable, so calling useTheme() or any sub-composable
 * directly always returns the same reactive instances.
 */
export const useTheme = () => ({
  ...useAccentColor(),
  ...useThemeContrast(),
  ...useThemeMotion(),
  ...useThemeTransparency(),
})
