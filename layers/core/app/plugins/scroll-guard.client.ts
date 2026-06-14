// plugins/scroll-guard.client.ts

import type { ScrollGuardConfig } from '#layers/core/app/types/scroll-guard'

type CoreLayerConfig = {
  scrollGuard?: Partial<ScrollGuardConfig>
}

/**
 * Horizontal Scroll Guard Plugin (Client-only)
 *
 * Prevents unintended horizontal scrolling by clamping overflowing elements
 * and hiding horizontal overflow on html/body.
 *
 * Configuration via app.config.ts:
 * - Set `coreLayer.scrollGuard.enabled: false` to disable
 * - Set `coreLayer.scrollGuard.debug: true` to highlight offenders
 *
 * Runtime control via composable:
 * - `useScrollGuard().disable()` to turn off
 * - `useScrollGuard().enable()` to turn back on
 */
export default defineNuxtPlugin({
  name: 'core:scroll-guard',
  setup() {
  const config = useAppConfig()
  const coreLayer = config.coreLayer as CoreLayerConfig | undefined

  if (coreLayer?.scrollGuard?.enabled === false) {
    if (import.meta.dev) {
      console.log('[Scroll Guard] Disabled via config')
    }
    return
  }

  const { enable, clampedCount } = useScrollGuard()

  enable()

  if (import.meta.dev) {
    console.log('[Scroll Guard] Initialized', {
      strict: coreLayer?.scrollGuard?.strict ?? true,
      debug: coreLayer?.scrollGuard?.debug ?? false,
      excludeSelectors: coreLayer?.scrollGuard?.excludeSelectors ?? [
        '.carousel',
        '.overflow-intent',
      ],
    })

    // Log clamped count after initial scan settles
    requestAnimationFrame(() => {
      console.log(`[Scroll Guard] Clamped ${clampedCount.value} element(s)`)
    })
  }
  },
})
