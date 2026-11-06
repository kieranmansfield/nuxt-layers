export default defineNuxtConfig({
  $meta: {
    name: 'metadata',
  },

  extends: ['../../core'],

  alias: {
    '#layers/metadata': import.meta.dirname,
    '#layers/metadata/shared': `${import.meta.dirname}/shared`,
  },

  compatibilityDate: '2026-10-27',

  runtimeConfig: {
    // NUXT_METADATA_LAYER_SYNC_SECRET: bearer token for POST /api/metadata/sync.
    // Unset, sync is open in dev and closed in production.
    metadataLayer: { syncSecret: '' },
  },

  nitro: {
    storage: {
      metadata: {
        driver: 'memory',
      },
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    metadataLayer: { syncSecret: string }
  }
}
