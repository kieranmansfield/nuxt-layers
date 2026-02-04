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
    '@nuxt/eslint',
    '@nuxt/ui',
    // '@nuxt/image'
    '@vueuse/nuxt',
    '@nuxtjs/device',
    // PWA module - only in production
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : []),
  ],

  css: ['#layers/core/app/assets/css/main.css'],

  plugins: [
    '#layers/core/app/plugins/init.ts',
    '#layers/core/app/plugins/error-handler.ts',
    '#layers/core/app/plugins/feature-detection.client.ts',
    '#layers/core/app/plugins/loading.client.ts',
  ],

  devtools: {
    enabled: true,

    vscode: {
      enabled: true,
    },
  },

  // Force light mode for consistent appearance
  colorMode: {
    preference: 'light',
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

  // PWA configuration (only applied when module is loaded in production)
  // pwa:
  //   process.env.NODE_ENV === 'production'
  //     ? {
  //         registerType: 'autoUpdate',
  //         manifest: {
  //           name: 'Core Layer App',
  //           short_name: 'Core Layer',
  //           description: 'Foundation layer for Nuxt applications',
  //           theme_color: '#ffffff',
  //           background_color: '#ffffff',
  //           display: 'standalone',
  //           start_url: '/',
  //         },
  //         workbox: {
  //           navigateFallback: '/',
  //           globPatterns: ['**/*.{js,css,html}'],
  //           globIgnores: ['**/node_modules/**/*'],
  //         },
  //       }
  //     : undefined,
})
