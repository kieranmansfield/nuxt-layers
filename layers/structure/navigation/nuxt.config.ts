export default defineNuxtConfig({
  $meta: { name: 'navigation' },

  extends: [
    '../../core',
    '../../motion/scroll',
    '../layout',
    '../../design-system/typography',
    '../../design-system/visual',
  ],

  alias: {
    '#layers/navigation': import.meta.dirname,
    '#layers/navigation/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-06-06',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
