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

  function applyColors() {
    const isDark = colorMode.value === 'dark'
    const primary = cssVarToHex('--ui-color-primary-500')
    // CSS vars not ready yet (returns fallback) — retry next frame
    if (primary === '#888888') {
      requestAnimationFrame(applyColors)
      return
    }
    primaryHex.value      = primary
    secondaryHex.value    = isDark ? cssVarToHex('--ui-color-neutral-700')   : cssVarToHex('--ui-color-secondary-500')
    primaryLightHex.value = isDark ? cssVarToHex('--ui-color-neutral-900')   : cssVarToHex('--ui-color-primary-300')
    infoHex.value         = isDark ? cssVarToHex('--ui-color-secondary-500') : cssVarToHex('--ui-color-neutral-300')
  }

  function refresh() {
    nextTick(applyColors)
  }

  if (import.meta.client) {
    watch(activeAccent, refresh, { immediate: true })
    watch(() => colorMode.value, refresh)
    onMounted(applyColors)
  }

  return { primaryHex, secondaryHex, infoHex, primaryLightHex, clearColor, refresh }
}
