export default defineNuxtConfig({
  $meta: {
    name: 'database',
  },

  extends: ['../core'],

  alias: {
    '#layers/database': import.meta.dirname,
  },

  compatibilityDate: '2026-06-28',

  runtimeConfig: {
    databaseLayer: {
      url: '', // env: NUXT_DATABASE_LAYER_URL  (Neon connection string)
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    databaseLayer?: { url: string }
  }
}
