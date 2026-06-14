// composables/useNetworkInfo.ts
import { useNetwork } from '@vueuse/core'

/**
 * Network information composable
 *
 * Wraps VueUse's useNetwork with additional helper computed values
 * for adaptive loading patterns.
 *
 * @returns Network state and connection information
 */
export function useNetworkInfo() {
  const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()

  /**
   * Connection is slow (2G or slower)
   */
  const isSlow = computed(() => {
    return (
      effectiveType.value === 'slow-2g' ||
      effectiveType.value === '2g' ||
      (downlink.value !== undefined && downlink.value < 1.5)
    )
  })

  /**
   * Connection is fast (4G or better)
   */
  const isFast = computed(() => {
    return effectiveType.value === '4g' || (downlink.value !== undefined && downlink.value > 5)
  })

  /**
   * Connection type is cellular (mobile data)
   */
  const isCellular = computed(() => {
    return type.value === 'cellular'
  })

  /**
   * Connection type is WiFi
   */
  const isWiFi = computed(() => {
    return type.value === 'wifi'
  })

  /**
   * Should limit bandwidth usage
   * (slow connection, data saver mode, or cellular)
   */
  const shouldLimitBandwidth = computed(() => {
    return isSlow.value || saveData.value || isCellular.value
  })

  /**
   * Connection quality description
   */
  const connectionQuality = computed<'excellent' | 'good' | 'poor' | 'offline'>(() => {
    if (!isOnline.value) return 'offline'
    if (isFast.value) return 'excellent'
    if (isSlow.value) return 'poor'
    return 'good'
  })

  return {
    // Raw network state (from VueUse)
    isOnline,
    offlineAt,
    downlink,
    downlinkMax,
    effectiveType,
    saveData,
    type,

    // Computed helpers
    isSlow,
    isFast,
    isCellular,
    isWiFi,
    shouldLimitBandwidth,
    connectionQuality,
  }
}
