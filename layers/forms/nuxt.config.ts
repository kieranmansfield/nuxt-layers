// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'forms',
  },

  alias: {
    '#layers/forms': import.meta.dirname,
  },

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
