// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'ui',
  },

  extends: ['../core'],

  alias: {
    '#layers/ui': import.meta.dirname,
    '#layers/ui/types': `${import.meta.dirname}/app/types`,
  },

  modules: [
    ...(process.env.NODE_ENV !== 'production' ? ['@nuxt/eslint'] : []),
    '@nuxt/ui',
    // '@nuxt/image'
  ],

  css: ['#layers/ui/app/assets/css/ui.css'],

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
