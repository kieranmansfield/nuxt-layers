// Starter app — showcase components for the boilerplate starter template
export default defineNuxtConfig({
  $meta: {
    name: 'starter',
  },

  extends: [
    '../../layers/core',
    '../../layers/design-system/typography',
    '../../layers/structure/navigation',
    '../../layers/design-system/visual',
    '../../layers/structure/layout',
    '../../layers/motion/motion',
  ],

  compatibilityDate: '2026-06-20',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
