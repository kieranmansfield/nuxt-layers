// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'core',
  },

  alias: {
    '#layers/core': import.meta.dirname,
  },

  // Base modules (always loaded)
  modules: [
    ...(process.env.NODE_ENV !== 'production' ? ['@nuxt/eslint'] : []),
    '@nuxt/ui',
    // '@nuxt/image'
    '@vueuse/nuxt',
    '@nuxtjs/device',
    // PWA module - only in production
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : []),
  ],

  css: ['#layers/core/app/assets/css/core.css'],

  devtools: {
    enabled: true,

    vscode: {
      enabled: true,
    },
  },

  // Force light mode for consistent appearance
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: true,
    strict: true,
  },

  vite: {
    build: {
      target: 'es2020',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],

      noscript: [
        // <noscript>JavaScript is required</noscript>
        { textContent: 'JavaScript is required' },
      ],
    },
  },

  // PWA configuration (only applied when module is loaded in production)
  pwa: {
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
      globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
    },
  },
})
