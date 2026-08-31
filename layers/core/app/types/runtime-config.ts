/**
 * Runtime config types
 *
 * Type-safe runtime configuration for the core layer
 * Extends Nuxt's RuntimeConfig with core layer specifics
 */

/**
 * Augment Nuxt's RuntimeConfig
 */
declare module '@nuxt/schema' {
  interface RuntimeConfig {
    secretKey?: string
    apiSecretKey?: string
    databaseUrl?: string
  }

  interface PublicRuntimeConfig {
    apiUrl?: string
    appName?: string
    appVersion?: string
    environment?: 'development' | 'staging' | 'production'
    siteUrl?: string
  }
}

export {}
