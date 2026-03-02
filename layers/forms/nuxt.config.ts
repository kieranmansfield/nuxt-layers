// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'forms',
  },

  alias: {
    '#layers/forms': import.meta.dirname,
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

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    formsLayer?: {
      resendApiKey: string
      emailFrom: string
      emailTo: string
    }
  }
}
