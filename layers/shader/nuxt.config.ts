export default defineNuxtConfig({
  $meta: {
    name: 'shader',
  },

  compatibilityDate: '2025-07-15',

  extends: ['../canvas'],

  typescript: {
    typeCheck: true,
    strict: true,
  },

  css: ['#layers/shader/app/assets/css/shader.css'],

  alias: {
    '#layers/shader': import.meta.dirname,
    '#layers/shader/types': `${import.meta.dirname}/app/types`,
  },

  imports: {
    dirs: [`${import.meta.dirname}/app/composables`],
  },
})
