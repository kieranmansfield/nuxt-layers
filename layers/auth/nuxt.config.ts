export default defineNuxtConfig({
  $meta: {
    name: 'auth',
  },

  extends: ['../core'],

  modules: ['nuxt-auth-utils'],

  alias: {
    '#layers/auth': import.meta.dirname,
  },

  compatibilityDate: '2026-06-28',

  runtimeConfig: {
    // nuxt-auth-utils reads these env vars automatically:
    session: { password: '' }, // env: NUXT_SESSION_PASSWORD
    oauth: {
      github: {
        clientId: '', // env: NUXT_OAUTH_GITHUB_CLIENT_ID
        clientSecret: '', // env: NUXT_OAUTH_GITHUB_CLIENT_SECRET
      },
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
