import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // extends: ['..'],
  extends: [
    '../../layers/core',
    // '@layers/core',
    // '@layers/ui',
    // '@layers/ui-layout'
  ],

  devtools: { enabled: true },

  // modules: ['@nuxt/eslint'],
  // eslint: {
  //   config: {
  //     // Use the generated ESLint config for lint root project as well
  //     rootDir: fileURLToPath(new URL('..', import.meta.url)),
  //   },
  // },
})
