export default defineNuxtConfig({
  $meta: { name: 'animations' },

  extends: ['../scroll', '../transitions'],

  alias: {
    '#layers/animations': import.meta.dirname,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
