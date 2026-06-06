export default defineNuxtConfig({
  $meta: { name: 'scroll' },

  extends: ['../core'],

  alias: {
    '#layers/scroll': import.meta.dirname,
    '#layers/scroll/types': `${import.meta.dirname}/app/types`,
  },

  modules: ['v-gsap-nuxt'],

  vgsap: {
    composable: true,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: true,
    strict: true,
  },

  build: {
    transpile: ['gsap'],
  },

  vite: {
    optimizeDeps: {
      include: ['locomotive-scroll'],
    },
  },
})
