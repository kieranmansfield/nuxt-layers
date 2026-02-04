// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'layout',
  },

  alias: {
    '#layers/layout': import.meta.dirname,
  },

  css: ['#layers/layout/app/assets/css/main.css'],

  compatibilityDate: '2026-01-20',
})
