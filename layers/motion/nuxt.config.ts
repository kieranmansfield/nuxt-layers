// Motion Layer - GSAP + Locomotive Scroll
export default defineNuxtConfig({
  $meta: {
    name: 'motion',
  },

  extends: ['../core'],

  alias: {
    '#layers/motion': import.meta.dirname,
    '#layers/motion/types': `${import.meta.dirname}/app/types`,
  },

  modules: ['v-gsap-nuxt'],

  vgsap: {
    composable: true,
  },

  css: ['#layers/motion/app/assets/css/motion.css'],

  compatibilityDate: '2026-01-30',

  typescript: {
    typeCheck: true,
    strict: true,
  },

  // Ensure GSAP is transpiled for SSR compatibility
  build: {
    transpile: ['gsap'],
  },

  vite: {
    optimizeDeps: {
      include: ['locomotive-scroll'],
    },
  },
})
