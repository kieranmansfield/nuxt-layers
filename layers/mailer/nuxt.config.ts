export default defineNuxtConfig({
  $meta: {
    name: 'mailer',
  },

  extends: ['../core'],

  alias: {
    '#layers/mailer': import.meta.dirname,
  },

  compatibilityDate: '2026-06-06',

  runtimeConfig: {
    mailerLayer: {
      resendApiKey: '', // env: NUXT_MAILER_LAYER_RESEND_API_KEY
      emailFrom: 'contact@example.com', // env: NUXT_MAILER_LAYER_EMAIL_FROM
      emailTo: '', // env: NUXT_MAILER_LAYER_EMAIL_TO
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
