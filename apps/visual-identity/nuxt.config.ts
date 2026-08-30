export default defineNuxtConfig({
  extends: [
    '../../layers/core',
    '../../layers/typography',
    '../../layers/navigation',
    '../../layers/visual',
    '../../layers/theming',
  ],

  modules: ['@nuxt/fonts'],

  fonts: {
    families: [{ name: 'Roboto Flex', provider: 'google' }],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-01-24',
})
