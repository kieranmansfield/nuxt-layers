export default defineNuxtConfig({
  $meta: { name: 'typography' },

  extends: ['../../core'],

  alias: {
    '#layers/typography': import.meta.dirname,
    '#layers/typography/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-10-27',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
