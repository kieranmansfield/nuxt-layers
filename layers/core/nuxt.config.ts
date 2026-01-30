// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'core',
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    // '@nuxt/image'
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@vite-pwa/nuxt',
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Core Layer App',
      short_name: 'Core Layer',
      description: 'Foundation layer for Nuxt applications',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      // icons: [
      //   {
      //     src: '/icon-192x192.png',
      //     sizes: '192x192',
      //     type: 'image/png',
      //   },
      //   {
      //     src: '/icon-512x512.png',
      //     sizes: '512x512',
      //     type: 'image/png',
      //   },
      // ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html}'],
      globIgnores: ['**/node_modules/**/*'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
    },
  },
})
