// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'scripts',
  },

  extends: ['../core'],

  modules: ['@nuxt/scripts'],

  alias: {
    '#layers/scripts': import.meta.dirname,
    '#layers/scripts/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
