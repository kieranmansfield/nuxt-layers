/* eslint-disable no-console */
// composables/useCache.ts
import { useOnline } from '@vueuse/core'

/**
 * Cache management composable for PWA
 *
 * Provides utilities for managing service worker cache,
 * checking offline readiness, and clearing cached data.
 *
 * @returns Cache state and management functions
 *
 * @example
 * ```typescript
 * const { isOnline, offlineReady, clearCache } = useCache()
 *
 * if (!isOnline && offlineReady) {
 *   // App works offline
 * }
 * ```
 */
export function useCache() {
  const isOnline = useOnline()
  const offlineReady = ref(false)

  /**
   * Check if a specific URL is cached
   * @param url - URL to check
   */
  async function isCached(url: string): Promise<boolean> {
    if (!import.meta.client || !('caches' in window)) return false

    try {
      const cache = await caches.open('workbox-precache-v2')
      const response = await cache.match(url)
      return !!response
    } catch (error) {
      console.warn('[useCache] Failed to check cache:', error)
      return false
    }
  }

  /**
   * Get total cache size in bytes
   */
  async function getCacheSize(): Promise<number> {
    if (!import.meta.client || !('caches' in window)) return 0

    try {
      const cacheNames = await caches.keys()
      let totalSize = 0

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()

        for (const request of requests) {
          const response = await cache.match(request)
          if (response) {
            const blob = await response.blob()
            totalSize += blob.size
          }
        }
      }

      return totalSize
    } catch (error) {
      console.warn('[useCache] Failed to get cache size:', error)
      return 0
    }
  }

  /**
   * Clear all caches
   */
  async function clearCache(): Promise<void> {
    if (!import.meta.client || !('caches' in window)) return

    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))

      console.log('[useCache] All caches cleared')
    } catch (error) {
      console.error('[useCache] Failed to clear cache:', error)
    }
  }

  /**
   * Get formatted cache size (human-readable)
   */
  async function getFormattedCacheSize(): Promise<string> {
    const bytes = await getCacheSize()

    if (bytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`
  }

  /**
   * Check if service worker has cached essential resources
   */
  async function checkOfflineReady(): Promise<boolean> {
    if (!import.meta.client || !('caches' in window)) return false

    try {
      const cacheNames = await caches.keys()
      // If we have any caches, consider offline ready
      offlineReady.value = cacheNames.length > 0
      return offlineReady.value
    } catch (error) {
      console.warn('[useCache] Failed to check offline readiness:', error)
      return false
    }
  }

  // Check offline readiness on mount
  if (import.meta.client) {
    checkOfflineReady()
  }

  return {
    // State
    isOnline,
    offlineReady: computed(() => offlineReady.value),

    // Actions
    isCached,
    clearCache,
    getCacheSize,
    getFormattedCacheSize,
    checkOfflineReady,
  }
}
