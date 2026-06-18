import {
  getBrowserVersionParts,
  isBrowserAtLeast,
  parseBrowserInfo,
  type BrowserInfo,
} from '#layers/core/app/utils/browserInfo'

/**
 * Browser detection composable
 *
 * Detects browser name, version, engine, and OS.
 * Uses user agent parsing (no external dependencies).
 *
 * Note: VueUse doesn't have browser detection yet.
 *
 * @returns Browser information and helper flags
 */
export function useBrowser() {
  const info = ref<BrowserInfo>(parseBrowserInfo())

  // Helper flags
  const isChrome = computed(() => info.value.name === 'chrome')
  const isSafari = computed(() => info.value.name === 'safari')
  const isFirefox = computed(() => info.value.name === 'firefox')
  const isEdge = computed(() => info.value.name === 'edge')
  const isOpera = computed(() => info.value.name === 'opera')

  // Engine flags
  const isWebKit = computed(() => info.value.engine === 'webkit')
  const isBlink = computed(() => info.value.engine === 'blink')
  const isGecko = computed(() => info.value.engine === 'gecko')

  // OS flags
  const isWindows = computed(() => info.value.os === 'windows')
  const isMacOS = computed(() => info.value.os === 'macos')
  const isLinux = computed(() => info.value.os === 'linux')
  const isAndroid = computed(() => info.value.os === 'android')
  const isIOS = computed(() => info.value.os === 'ios')

  // Version helpers
  const majorVersion = computed(() => {
    return getBrowserVersionParts(info.value.version).major
  })

  const minorVersion = computed(() => {
    return getBrowserVersionParts(info.value.version).minor
  })

  /**
   * Check if browser version is at least the specified version
   * @param minVersion - Minimum version string (e.g., "100" or "100.0")
   */
  const isAtLeast = (minVersion: string): boolean => {
    return isBrowserAtLeast(info.value.version, minVersion)
  }

  return {
    // Raw browser info
    name: computed(() => info.value.name),
    version: computed(() => info.value.version),
    engine: computed(() => info.value.engine),
    os: computed(() => info.value.os),

    // Browser flags
    isChrome,
    isSafari,
    isFirefox,
    isEdge,
    isOpera,

    // Engine flags
    isWebKit,
    isBlink,
    isGecko,

    // OS flags
    isWindows,
    isMacOS,
    isLinux,
    isAndroid,
    isIOS,

    // Version helpers
    majorVersion,
    minorVersion,
    isAtLeast,
  }
}
