// Starter app — showcase components for the boilerplate starter template
export default defineNuxtConfig({
  $meta: {
    name: 'starter',
  },

  extends: [
    '../../layers/core',
    '../../layers/typography',
    '../../layers/navigation',
    '../../layers/visual',
    '../../layers/layout',
    '../../layers/motion',
  ],

  compatibilityDate: '2026-06-20',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
