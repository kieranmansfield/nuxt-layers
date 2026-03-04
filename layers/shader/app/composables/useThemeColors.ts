import { parseOKLCH, oklchToColor } from '../utils/tsl/oklch'

export function useThemeColors() {
  const { activeAccent } = useAccentColor()
  const colorMode = useColorMode()

  const primaryHex = ref('#8b5cf6')
  const secondaryHex = ref('#6366f1')
  const infoHex = ref('#38bdf8')
  const primaryLightHex = ref('#a78bfa')

  const clearColor = computed(() =>
    colorMode.value === 'dark' ? '#0a0a0a' : '#f8f8f8'
  )

  function cssVarToHex(varName: string): string {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName).trim()
    try {
      const [l, c, h] = parseOKLCH(raw)
      return `#${oklchToColor(l, c, h).getHexString()}`
    } catch {
      return '#888888'
    }
  }

  function refresh() {
    nextTick(() => {
      const isDark = colorMode.value === 'dark'
      primaryHex.value      = cssVarToHex(isDark ? '--ui-color-primary-500'   : '--ui-color-primary-600')
      secondaryHex.value    = cssVarToHex(isDark ? '--ui-color-secondary-500' : '--ui-color-secondary-700')
      primaryLightHex.value = cssVarToHex(isDark ? '--ui-color-primary-300'   : '--ui-color-primary-400')
      infoHex.value         = cssVarToHex(isDark ? '--ui-color-info-500'      : '--ui-color-info-600')
    })
  }

  if (import.meta.client) {
    watch(activeAccent, refresh, { immediate: true })
    watch(() => colorMode.value, refresh)
  }

  return { primaryHex, secondaryHex, infoHex, primaryLightHex, clearColor, refresh }
}
