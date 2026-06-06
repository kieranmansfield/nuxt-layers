export default defineNuxtConfig({
  $meta: { name: 'transitions' },

  extends: ['../core'],

  alias: {
    '#layers/transitions': import.meta.dirname,
    '#layers/transitions/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/transitions/app/assets/css/transitions.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
