/**
 * Override for the browser-chrome `theme-color`, which otherwise follows the page background
 * (see plugins/theme-color.ts, enabled by `themeLayer.themeColor.enabled`). Set a colour while
 * something covers the page, `null` to release it. Hex or rgb() is safest - not every browser
 * takes oklch() here.
 */
export const useThemeColorOverride = () =>
  useState<string | null>('theme:theme-color:override', () => null)
