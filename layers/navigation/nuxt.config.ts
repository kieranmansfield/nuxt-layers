export default defineNuxtConfig({
  $meta: { name: 'navigation' },

  extends: ['../core', '../scroll', '../layout', '../typography'],

  alias: {
    '#layers/navigation': import.meta.dirname,
    '#layers/navigation/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/navigation/app/assets/css/navigation.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
