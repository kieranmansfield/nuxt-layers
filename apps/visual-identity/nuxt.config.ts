export default defineNuxtConfig({
  extends: [
    '../../layers/core',
    '../../layers/ui',
    '../../layers/theme',
  ],

  modules: ['@nuxt/fonts'],

  fonts: {
    families: [
      { name: 'Roboto Flex', provider: 'google' },
    ],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-01-24',
})
