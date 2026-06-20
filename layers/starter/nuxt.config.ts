// Starter layer — showcase components for the boilerplate starter template
export default defineNuxtConfig({
  $meta: {
    name: 'starter',
  },

  extends: ['../core', '../ui', '../layout', '../motion'],

  compatibilityDate: '2026-06-20',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
