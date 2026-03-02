// Motion Layer - GSAP + Locomotive Scroll
export default defineNuxtConfig({
  $meta: {
    name: 'motion',
  },

  alias: {
    '#layers/motion': import.meta.dirname,
  },

  modules: ['v-gsap-nuxt'],

  vgsap: {
    composable: true,
  },

  css: ['#layers/motion/app/assets/css/main.css'],

  compatibilityDate: '2026-01-30',

  // Ensure GSAP is transpiled for SSR compatibility
  build: {
    transpile: ['gsap'],
  },
})
