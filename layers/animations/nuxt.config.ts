export default defineNuxtConfig({
  $meta: { name: 'animations' },

  extends: ['../scroll'],

  alias: {
    '#layers/animations': import.meta.dirname,
    '#layers/animations/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
