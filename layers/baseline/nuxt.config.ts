export default defineNuxtConfig({
  $meta: {
    name: 'baseline',
  },

  extends: ['../core'],

  alias: {
    '#layers/baseline': import.meta.dirname,
  },

  compatibilityDate: '2026-06-06',

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'baseline-status' || tag === 'baseline-icon',
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
