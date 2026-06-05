// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'feeds',
  },

  extends: process.env.FEEDS_STANDALONE ? ['../core'] : [],

  alias: {
    '#layers/feeds': import.meta.dirname,
  },

  modules: [
    ...(process.env.NODE_ENV !== 'production' ? ['@nuxt/eslint'] : []),
    // '@nuxt/ui',
  ],

  compatibilityDate: '2025-07-15',
  // devtools: { enabled: true }

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
