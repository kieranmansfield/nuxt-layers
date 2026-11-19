import type { NotFoundConfig } from './types/notFound'
import type { SiteConfig } from './types/site'

export default defineAppConfig({
  coreLayer: {
    // 404 Page defaults (all optional)
    notFound: {
      // Visual
      icon: 'i-lucide-file-question',
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
      showPath: true,

      // Actions
      showHomeButton: true,
      homeButtonLabel: 'Go Home',
      homeButtonTo: '/',
      showBackButton: true,
      backButtonLabel: 'Go Back',

      // Custom actions (empty by default)
      actions: [],

      // Suggestions (disabled by default)
      suggestions: {
        enabled: false,
        title: 'You might be looking for:',
        links: [],
      },
    },

    // Loading screen configuration (initial app load only)
    loading: {
      // On by default: the backdrop covers the page from first paint, so nothing flashes in
      // before its entrance animations are ready
      enabled: true,
      // Minimum time (ms, from navigation start) before the count may reach 100 - 0 finishes
      // as soon as the work does; raise it only for a deliberate brand moment
      minDuration: 0,
      // Longest wait (ms, from navigation start) for assets and fonts before finishing anyway
      maxDuration: 10000,
      // Delay (ms, from the screen's first paint) before the counter fades in - faster loads
      // only see the backdrop fade away
      showAfter: 400,
      // Small caption above the counter - empty string hides it
      label: 'Loading',
      // Background color
      background: '#0a0a0a',
      // Progress text color
      textColor: '#ffffff',
      // Stack order
      zIndex: 10000,
    },

    // Error handling configuration
    errors: {
      // Console logging (enabled in development by default)
      logToConsole: true,
      // External error service logging (disabled by default)
      logToExternal: false,
      // External error service URL (e.g., Sentry, LogRocket)
      externalUrl: '',
      // External error service token/key
      externalToken: '',
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /** Shared site metadata — consumed by feeds, SEO, and any layer needing canonical site info. */
    site?: SiteConfig
    coreLayer?: {
      /** Project name */
      name?: string

      /** 404 Not Found page configuration */
      notFound?: NotFoundConfig

      loading?: {
        enabled?: boolean
        minDuration?: number
        maxDuration?: number
        showAfter?: number
        label?: string
        background?: string
        textColor?: string
        zIndex?: number
      }

      errors?: {
        logToConsole?: boolean
        logToExternal?: boolean
        externalUrl?: string
        externalToken?: string
      }
    }
  }
}
