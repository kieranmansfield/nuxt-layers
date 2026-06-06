// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'layout',
  },

  extends: ['../core'],

  alias: {
    '#layers/layout': import.meta.dirname,
    '#layers/layout/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/layout/app/assets/css/layout.css'],

  compatibilityDate: '2026-01-20',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
