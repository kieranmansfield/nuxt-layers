export default defineNuxtConfig({
  $meta: { name: 'animations' },

  extends: ['../scroll', '../transitions'],

  alias: {
    '#layers/animations': import.meta.dirname,
  },

  compatibilityDate: '2026-10-27',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
