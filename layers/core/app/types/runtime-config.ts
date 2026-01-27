/**
 * Runtime config types
 *
 * Type-safe runtime configuration for the core layer
 * Extends Nuxt's RuntimeConfig with core layer specifics
 */

export interface CoreLayerRuntimeConfig {
  // Server-side only (private)
  secretKey?: string
  apiSecretKey?: string
  databaseUrl?: string

  // Public (exposed to client)
  public: {
    apiUrl?: string
    appName?: string
    appVersion?: string
    environment?: 'development' | 'staging' | 'production'
    siteUrl?: string
  }
}

/**
 * Augment Nuxt's RuntimeConfig
 */
declare module 'nuxt/schema' {
  interface RuntimeConfig extends CoreLayerRuntimeConfig {}
}

export {}
