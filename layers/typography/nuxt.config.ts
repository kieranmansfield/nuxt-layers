export default defineNuxtConfig({
  $meta: { name: 'typography' },

  extends: ['../core'],

  alias: {
    '#layers/typography': import.meta.dirname,
    '#layers/typography/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/typography/app/assets/css/typography.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
