// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'ui',
  },

  // Only extend core when running standalone dev (via dev:ui script)
  extends: process.env.UI_STANDALONE ? ['../core'] : [],

  alias: {
    '#layers/ui': import.meta.dirname,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    // '@nuxt/image'
  ],

  css: ['#layers/ui/app/assets/css/main.css'],

  // devtools: {
  //   enabled: true,
  // },

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: true,
    strict: true,
  },

  // vite: {
  //   build: {
  //     target: 'es2020',
  //   },
  // },
})
