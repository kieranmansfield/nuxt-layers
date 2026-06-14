export default defineAppConfig({
  scriptsLayer: {
    consent: {
      required: false,
      storageKey: 'scripts-consent',
    },
    analytics: {
      provider: null as 'ga4' | 'plausible' | 'fathom' | null,
      id: '',
    },
    gtm: {
      enabled: false,
      id: '',
    },
    performance: {
      prefetchLinks: true,
      preconnect: [] as string[],
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    scriptsLayer?: {
      consent?: {
        required?: boolean
        storageKey?: string
      }
      analytics?: {
        provider?: 'ga4' | 'plausible' | 'fathom' | null
        id?: string
      }
      gtm?: {
        enabled?: boolean
        id?: string
      }
      performance?: {
        prefetchLinks?: boolean
        preconnect?: string[]
      }
    }
  }
}
