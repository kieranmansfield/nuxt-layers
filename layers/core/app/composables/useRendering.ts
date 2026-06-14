// composables/useRendering.ts

type RenderMode = 'ssr' | 'ssg' | 'csr' | 'hybrid'

/**
 * Rendering mode detection composable
 *
 * Detects the current rendering mode and provides helpers
 * for server/client-specific logic and hydration state.
 *
 * Note: This DETECTS the mode, it does NOT choose it.
 * The mode is chosen by Nuxt via routeRules in nuxt.config.ts.
 *
 * @returns Rendering state and mode information
 *
 * @example
 * ```typescript
 * const { mode, isClient, isHydrated } = useRendering()
 *
 * // Wait for hydration before interactive elements
 * <button :disabled="!isHydrated">Click me</button>
 * ```
 */
export function useRendering() {
  const nuxtApp = useNuxtApp()

  /**
   * Is code running on the server (Node.js)?
   */
  const isServer = computed(() => import.meta.server)

  /**
   * Is code running in the browser?
   */
  const isClient = computed(() => import.meta.client)

  /**
   * Is Vue currently taking control of the server-rendered HTML?
   */
  const isHydrating = computed(() => nuxtApp.isHydrating)

  /**
   * Has hydration completed? Is the page fully interactive?
   */
  const isHydrated = computed(() => {
    // On server, never hydrated
    if (import.meta.server) return false

    // On client, check if hydration is complete
    return !nuxtApp.isHydrating
  })

  /**
   * Detect the current rendering mode
   *
   * - SSR: Server-Side Rendering (HTML generated per request)
   * - SSG: Static Site Generation (HTML pre-built at build time)
   * - CSR: Client-Side Rendering (SPA, no server HTML)
   * - Hybrid: Mix of above per route
   */
  const mode = computed<RenderMode>(() => {
    // Check if we have SSR/SSG by looking at payload
    const payload = nuxtApp.payload

    // If running on server, it's SSR or SSG
    if (import.meta.server) {
      // Check if prerendering (SSG)
      if (nuxtApp.ssrContext?.event?.context?.prerender) {
        return 'ssg'
      }
      return 'ssr'
    }

    // On client, check if we have server-rendered content
    if (payload.serverRendered) {
      // Could be SSR or SSG - check if we have build-time data
      // SSG typically has static payload, SSR has fresh data
      return payload.prerendered ? 'ssg' : 'ssr'
    }

    // No server rendering = CSR
    return 'csr'
  })

  return {
    // Mode detection
    mode,

    // Environment flags
    isServer,
    isClient,

    // Hydration state
    isHydrating,
    isHydrated,
  }
}
