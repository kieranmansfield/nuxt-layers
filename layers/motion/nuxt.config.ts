// Motion Layer - GSAP, Lenis, VueUse Motion, Locomotive Scroll
export default defineNuxtConfig({
  $meta: {
    name: 'motion',
  },

  modules: [
    'lenis/nuxt',
    '@vueuse/motion/nuxt',
  ],

  css: ['#layers/motion/app/assets/css/main.css'],

  compatibilityDate: '2026-01-30',

  // Ensure GSAP is transpiled for SSR compatibility
  build: {
    transpile: ['gsap'],
  },

  // VueUse Motion preset directives
  motion: {
    directives: {
      'pop-bottom': {
        initial: { scale: 0, opacity: 0, y: 100 },
        visible: { scale: 1, opacity: 1, y: 0 },
      },
      'slide-left': {
        initial: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      'slide-right': {
        initial: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      'fade-in': {
        initial: { opacity: 0 },
        visible: { opacity: 1 },
      },
      'fade-up': {
        initial: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      },
    },
  },
})