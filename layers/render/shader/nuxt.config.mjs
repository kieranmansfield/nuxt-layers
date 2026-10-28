export default defineNuxtConfig({
  $meta: {
    name: 'shader',
  },
  compatibilityDate: '2025-07-15',
  extends: ['../canvas', '../../design-system/theming'],
  typescript: {
    typeCheck: false,
    strict: true,
  },
  css: ['#layers/shader/app/assets/css/shader.css'],
  alias: {
    '#layers/shader': import.meta.dirname,
    '#layers/shader/types': `${import.meta.dirname}/app/types`,
  },
})
