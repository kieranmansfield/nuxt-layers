// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'capture',
  },

  extends: ['../../core'],

  alias: {
    '#layers/capture': import.meta.dirname,
  },

  compatibilityDate: '2026-10-27',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
