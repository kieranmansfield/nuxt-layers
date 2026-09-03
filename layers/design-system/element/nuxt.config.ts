export default defineNuxtConfig({
  $meta: { name: 'element' },

  extends: ['../../core'],

  alias: {
    '#layers/element': import.meta.dirname,
    '#layers/element/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
