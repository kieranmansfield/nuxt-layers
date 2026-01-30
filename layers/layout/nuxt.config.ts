// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'layout',
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    // '@nuxt/image',
    // '@nuxt/scripts',
  ],

  // devtools: {
  //   enabled: true
  // },

  css: ['#layers/layout/app/assets/css/main.css'],

  // routeRules: {
  //   '/': { prerender: true },
  // },

  compatibilityDate: '2026-01-20',

  typescript: {
    typeCheck: true,
    strict: true,
  },

  ui: {
    fonts: false,
  },
})
