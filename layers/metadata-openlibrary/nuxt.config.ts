export default defineNuxtConfig({
  $meta: {
    name: 'metadata-openlibrary',
  },

  extends: ['../metadata'],

  alias: {
    '#layers/metadata-openlibrary': import.meta.dirname,
  },

  compatibilityDate: '2026-06-30',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
