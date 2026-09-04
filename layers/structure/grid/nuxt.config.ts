// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'grid',
  },

  extends: ['../../core'],

  alias: {
    '#layers/grid': import.meta.dirname,
    '#layers/grid/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/grid/app/assets/css/grid.css'],

  compatibilityDate: '2026-01-20',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
