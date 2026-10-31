import type { PageTransitionRule } from './types'

export default defineAppConfig({
  pageTransitions: {
    /** Preset used when nothing more specific matches. `none` disables transitions. */
    default: 'fade',
    /** Milliseconds per phase, for presets that don't set their own. */
    duration: 300,
    /** First match wins: [{ from: '/blog', to: '/', name: 'curved' }] (path prefixes). */
    rules: [] as PageTransitionRule[],
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    pageTransitions?: {
      default?: string
      duration?: number
      rules?: PageTransitionRule[]
    }
  }
}
