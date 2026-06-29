export default defineNuxtConfig({
  $meta: {
    name: 'metadata',
  },

  extends: ['../core'],

  alias: {
    '#layers/metadata': import.meta.dirname,
    '#layers/metadata/shared': `${import.meta.dirname}/shared`,
  },

  compatibilityDate: '2026-06-30',

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
