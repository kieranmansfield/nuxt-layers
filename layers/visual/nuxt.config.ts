export default defineNuxtConfig({
  $meta: { name: 'visual' },

  extends: ['../core'],

  alias: {
    '#layers/visual': import.meta.dirname,
    '#layers/visual/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/visual/app/assets/css/visual.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
