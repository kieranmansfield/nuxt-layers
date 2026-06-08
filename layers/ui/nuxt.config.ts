// UI orchestrator — composes typography, navigation, and visual
export default defineNuxtConfig({
  $meta: {
    name: 'ui',
  },

  extends: ['../typography', '../navigation', '../visual'],

  alias: {
    '#layers/ui': import.meta.dirname,
    '#layers/ui/types': `${import.meta.dirname}/app/types`,
  },

  css: ['#layers/ui/app/assets/css/ui.css'],

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
