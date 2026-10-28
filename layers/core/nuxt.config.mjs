import { createRequire } from 'node:module'
// @nuxt/eslint is an optional peer: load it outside production only when the app has it
// installed, otherwise a consumer without it fails module resolution in dev/test builds.
const lintModules = []
if (process.env.NODE_ENV !== 'production') {
  try {
    createRequire(import.meta.url).resolve('@nuxt/eslint')
    lintModules.push('@nuxt/eslint')
  } catch {}
}
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'core',
  },
  alias: {
    // More specific key first — Vite/vite-node's alias matcher is first-match-wins
    // (declaration order), not longest-prefix. '#layers/core' would otherwise
    // intercept '#layers/core/types/*' lookups before this entry is reached.
    '#layers/core/types': `${import.meta.dirname}/app/types`,
    '#layers/core': import.meta.dirname,
    '#types': `${import.meta.dirname}/../../types`,
  },
  // Base modules (always loaded)
  modules: [
    ...lintModules,
    '@nuxt/ui',
    // '@nuxt/image'
    '@vueuse/nuxt',
    '@nuxtjs/device',
    // PWA module — disabled pending a decision on the PWA approach; useCache/usePWAInfo
    // stay in place, dormant, ready to re-enable.
    // ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : []),
  ],
  css: ['#layers/core/app/assets/css/core.css'],
  // Follow the OS colour scheme; light when it can't be detected
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  compatibilityDate: '2026-01-24',
  typescript: {
    // vite-plugin-checker@0.14.1 bundles TypeScript 6 which crashes on Nuxt's
    // generated tsconfig.shared.json (noEmit:true + getFirstProjectOutput = Debug.fail).
    // Disable dev typecheck; use `pnpm typecheck` or IDE (Volar) for type checking.
    typeCheck: false,
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
        // Opt page into browser's text-scale preference respecting default font size
        { name: 'text-scale', content: 'scale' },
      ],
      noscript: [
        // <noscript>JavaScript is required</noscript>
        { textContent: 'JavaScript is required' },
      ],
    },
  },
  // PWA configuration — dormant while @vite-pwa/nuxt is disabled above.
  // pwa: {
  //   workbox: {
  //     globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
  //     globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
  //   },
  // },
})
