export default defineNuxtConfig({
  $meta: { name: 'page-transitions' },

  extends: ['../../core'],

  alias: {
    '#layers/page-transitions': import.meta.dirname,
    '#layers/page-transitions/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/page-transitions/app/assets/css/page-transitions.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
