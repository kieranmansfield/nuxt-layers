import {
  createSharedComposable,
  useLocalStorage,
  usePreferredContrast,
  usePreferredReducedMotion,
  usePreferredReducedTransparency,
} from '@vueuse/core'
import type { AccentColor, PreferenceOverride } from '#layers/theme/app/types/theme'

const HTML_CLASSES = {
  highContrast: 'high-contrast',
  reduceMotion: 'reduce-motion',
  reduceTransparency: 'reduce-transparency',
} as const

/**
 * Central composable for managing theme preferences.
 *
 * Wrapped with `createSharedComposable` so all callers share a single
 * reactive instance — changes in the popover menu are immediately
 * reflected on the page and vice versa.
 *
 * Accent colors are applied purely via a `[data-theme]` attribute on `<html>`.
 * The server plugin injects a `<style>` tag with `[data-theme="X"]` CSS rules
 * that override Nuxt UI's `@layer theme` variables — no appConfig mutation needed.
 */
export const useThemePreferences = createSharedComposable(() => {
  const appConfig = useAppConfig()

  // --- Accent Color (user preference, persisted) ---
  const defaultAccent = ((appConfig as any).themeLayer?.defaultAccent ?? 'blue') as AccentColor
  const accent = useLocalStorage<AccentColor>('theme-accent', defaultAccent)

  // --- Page-level Accent Override (runtime only, not persisted) ---
  const pageAccent = ref<AccentColor | null>(null)
  const activeAccent = computed<AccentColor>(() => pageAccent.value ?? accent.value)

  // --- User Overrides (localStorage) ---
  const contrastOverride = useLocalStorage<PreferenceOverride>(
    'theme-contrast',
    'system',
  )
  const motionOverride = useLocalStorage<PreferenceOverride>(
    'theme-motion',
    'system',
  )
  const transparencyOverride = useLocalStorage<PreferenceOverride>(
    'theme-transparency',
    'system',
  )

  // --- System Preferences (VueUse media queries) ---
  const systemContrast = usePreferredContrast()
  const systemMotion = usePreferredReducedMotion()
  const systemTransparency = usePreferredReducedTransparency()

  // --- Effective (merged) Preferences ---
  const effectiveHighContrast = computed(() => {
    if (contrastOverride.value === 'on') return true
    if (contrastOverride.value === 'off') return false
    return systemContrast.value === 'more'
  })

  const effectiveReducedMotion = computed(() => {
    if (motionOverride.value === 'on') return true
    if (motionOverride.value === 'off') return false
    return systemMotion.value === 'reduce'
  })

  const effectiveReducedTransparency = computed(() => {
    if (transparencyOverride.value === 'on') return true
    if (transparencyOverride.value === 'off') return false
    return systemTransparency.value === 'reduce'
  })

  // --- DOM Side Effects ---
  function applyAccent(color: AccentColor) {
    if (!import.meta.client) return
    // Setting data-theme activates the matching [data-theme="X"] CSS rule
    // from the server-injected <style> tag, which overrides Nuxt UI's
    // @layer theme variables. No appConfig mutation needed (avoids HMR loops).
    document.documentElement.setAttribute('data-theme', color)
  }

  function applyPreferenceClasses() {
    if (!import.meta.client) return
    const cl = document.documentElement.classList

    cl.toggle(HTML_CLASSES.highContrast, effectiveHighContrast.value)
    cl.toggle(HTML_CLASSES.reduceMotion, effectiveReducedMotion.value)
    cl.toggle(HTML_CLASSES.reduceTransparency, effectiveReducedTransparency.value)
  }

  // --- Setters ---
  function setAccent(color: AccentColor) {
    accent.value = color
  }

  function setPageAccent(color: AccentColor | null) {
    pageAccent.value = color
  }

  function setContrastOverride(value: PreferenceOverride) {
    contrastOverride.value = value
  }

  function setMotionOverride(value: PreferenceOverride) {
    motionOverride.value = value
  }

  function setTransparencyOverride(value: PreferenceOverride) {
    transparencyOverride.value = value
  }

  // --- Watchers ---
  if (import.meta.client) {
    // Apply accent on change (uses activeAccent = page override or user pref)
    watch(activeAccent, (color) => applyAccent(color), { immediate: true })

    // Apply preference classes on any effective change
    watch(
      [effectiveHighContrast, effectiveReducedMotion, effectiveReducedTransparency],
      () => applyPreferenceClasses(),
      { immediate: true },
    )
  }

  return {
    // Accent (user preference)
    accent: readonly(accent),
    setAccent,

    // Page override
    pageAccent: readonly(pageAccent),
    setPageAccent,

    // Effective accent (page override wins over user preference)
    activeAccent,

    // Overrides
    contrastOverride: readonly(contrastOverride),
    motionOverride: readonly(motionOverride),
    transparencyOverride: readonly(transparencyOverride),
    setContrastOverride,
    setMotionOverride,
    setTransparencyOverride,

    // Effective (computed booleans)
    effectiveHighContrast,
    effectiveReducedMotion,
    effectiveReducedTransparency,

    // System values (for display)
    systemContrast,
    systemMotion,
    systemTransparency,
  }
})
