/**
 * Feature detection types
 *
 * Type definitions for CSS features, JS APIs, user preferences,
 * and image format detection
 */

export interface FeatureDetection {
  // CSS Features
  grid: boolean
  subgrid: boolean
  containerQueries: boolean
  has: boolean
  aspectRatio: boolean
  logicalProperties: boolean
  backdropFilter: boolean

  // JS APIs
  intersectionObserver: boolean
  resizeObserver: boolean
  serviceWorker: boolean
  webGL: boolean

  // User Preferences
  darkMode: boolean
  reducedMotion: boolean
  highContrast: boolean

  // Image Formats
  webp: boolean
  avif: boolean
}

/**
 * Device detection types
 */
export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean
}

/**
 * Browser detection types
 */
export interface BrowserInfo {
  isChrome: boolean
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isIE: boolean
  version: string
  name: string
}

/**
 * Screen detection types
 */
export interface ScreenInfo {
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  width: number
  height: number
  isRetina: boolean
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
}

/**
 * Network information types
 */
export interface NetworkInfo {
  isOnline: boolean
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'ethernet' | 'unknown'
  effectiveType: string
  downlink: number // Mbps
  rtt: number // Round-trip time in ms
  saveData: boolean
  isSlow: boolean
  isFast: boolean
}

/**
 * Rendering mode types
 */
export type RenderingMode = 'ssr' | 'ssg' | 'csr' | 'hybrid'

export interface RenderingInfo {
  mode: RenderingMode
  isServer: boolean
  isClient: boolean
  isHydrating: boolean
  isHydrated: boolean
}

/**
 * PWA types
 */
export interface PWAInfo {
  isInstalled: boolean
  canInstall: boolean
  needRefresh: boolean
}

/**
 * Cache types
 */
export interface CacheInfo {
  isOnline: boolean
  offlineReady: boolean
  isCached: boolean
  cacheSize: number
}
