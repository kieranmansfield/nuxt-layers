// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'forms',
  },

  extends: ['../mailer'],

  alias: {
    '#layers/forms': import.meta.dirname,
    '#layers/forms/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
