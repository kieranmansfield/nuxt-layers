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

  // App-level choices (previously forced on every consumer by the core layer)
  future: {
    compatibilityVersion: 5,
  },

  devtools: {
    enabled: true,
    vscode: {
      enabled: true,
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
