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
      // Master toggle - set to false to disable completely
      enabled: true,
      // Minimum time to display loading screen (prevents flash)
      minDuration: 3000, // Temporarily increased for testing
      // Maximum time for simulated progress
      maxDuration: 3000,
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
