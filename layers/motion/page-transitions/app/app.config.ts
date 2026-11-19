import type { PageTransitionRule } from './types'

export default defineAppConfig({
  pageTransitions: {
    /** Preset used when nothing more specific matches. `none` disables transitions. */
    default: 'fade',
    /** Milliseconds per phase, for presets that don't set their own. */
    duration: 300,
    /**
     * Preset played once on first page load. `none` plays nothing. Use one that reveals the page
     * itself (`fade`, `slide`, `crossfade`, `slide-x`): overlay presets such as `wipe` have no
     * cover on screen to remove unless they define their own `once`.
     */
    once: 'none',
    /** First match wins: [{ from: '/blog', to: '/', name: 'curved' }] (path prefixes). */
    rules: [] as PageTransitionRule[],
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    pageTransitions?: {
      default?: string
      duration?: number
      once?: string
      rules?: PageTransitionRule[]
    }
  }
}
