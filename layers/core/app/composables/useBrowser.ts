// composables/useBrowser.ts
import { computed, ref } from 'vue'

interface BrowserInfo {
  name: string
  version: string
  engine: string
  os: string
}

/**
 * Parse user agent to detect browser information
 */
function parseBrowserInfo(): BrowserInfo {
  if (!import.meta.client) {
    return {
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      os: 'unknown',
    }
  }

  const ua = navigator.userAgent
  let name = 'unknown'
  let version = '0'
  let engine = 'unknown'
  let os = 'unknown'

  // Detect OS
  if (ua.includes('Win')) os = 'windows'
  else if (ua.includes('Mac')) os = 'macos'
  else if (ua.includes('Linux')) os = 'linux'
  else if (ua.includes('Android')) os = 'android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'ios'

  // Detect browser (order matters - check most specific first)
  if (ua.includes('Edg/')) {
    name = 'edge'
    engine = 'blink'
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || '0'
  } else if (ua.includes('Chrome/') && !ua.includes('Edg')) {
    name = 'chrome'
    engine = 'blink'
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '0'
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'safari'
    engine = 'webkit'
    version = ua.match(/Version\/([\d.]+)/)?.[1] || '0'
  } else if (ua.includes('Firefox/')) {
    name = 'firefox'
    engine = 'gecko'
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '0'
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    name = 'opera'
    engine = 'blink'
    version = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || '0'
  }

  return { name, version, engine, os }
}

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
    const parts = info.value.version.split('.')
    const major = parts[0]
    return major ? parseInt(major, 10) : 0
  })

  const minorVersion = computed(() => {
    const parts = info.value.version.split('.')
    const minor = parts[1] || '0'
    return parseInt(minor, 10)
  })

  /**
   * Check if browser version is at least the specified version
   * @param minVersion - Minimum version string (e.g., "100" or "100.0")
   */
  const isAtLeast = (minVersion: string): boolean => {
    const parts = minVersion.split('.')
    const minMajor = parts[0]
    const minMinor = parts[1] || '0'

    if (!minMajor) return false

    const major = majorVersion.value
    const minor = minorVersion.value

    const minMajorNum = parseInt(minMajor, 10)
    const minMinorNum = parseInt(minMinor, 10)

    if (major > minMajorNum) return true
    if (major === minMajorNum && minor >= minMinorNum) return true

    return false
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
