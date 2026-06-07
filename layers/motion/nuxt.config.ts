// Motion orchestrator — composes scroll, animations, transitions, and page-transitions
export default defineNuxtConfig({
  $meta: {
    name: 'motion',
  },

  extends: ['../scroll', '../animations', '../transitions', '../page-transitions'],

  alias: {
    '#layers/motion': import.meta.dirname,
    '#layers/motion/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
