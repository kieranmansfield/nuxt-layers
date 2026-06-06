// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'forms',
  },

  extends: ['../core'],

  alias: {
    '#layers/forms': import.meta.dirname,
    '#layers/forms/types': `${import.meta.dirname}/app/types`,
  },

  compatibilityDate: '2026-01-24',

  runtimeConfig: {
    formsLayer: {
      resendApiKey: '', // env: NUXT_FORMS_LAYER_RESEND_API_KEY
      emailFrom: 'contact@example.com', // env: NUXT_FORMS_LAYER_EMAIL_FROM
      emailTo: '', // env: NUXT_FORMS_LAYER_EMAIL_TO
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },
})
