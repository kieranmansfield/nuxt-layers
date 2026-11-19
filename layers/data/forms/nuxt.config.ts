// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'forms',
  },

  extends: ['../mailer'],

  alias: {
    '#layers/forms': import.meta.dirname,
    '#layers/forms/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-10-27',

  nitro: {
    storage: {
      // Per instance by default. Point this at a shared driver to hold the limit across instances.
      'rate-limit': { driver: 'memory' },
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
