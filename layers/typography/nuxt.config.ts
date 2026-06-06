export default defineNuxtConfig({
  $meta: { name: 'typography' },

  extends: ['../core'],

  alias: {
    '#layers/typography': import.meta.dirname,
    '#layers/typography/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
