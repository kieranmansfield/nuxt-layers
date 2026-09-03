export default defineNuxtConfig({
  extends: [
    '../../layers/core',
    '../../layers/design-system/typography',
    '../../layers/structure/navigation',
    '../../layers/design-system/visual',
    '../../layers/design-system/theming',
  ],

  modules: ['@nuxt/fonts'],

  fonts: {
    families: [{ name: 'Roboto Flex', provider: 'google' }],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-01-24',
})
