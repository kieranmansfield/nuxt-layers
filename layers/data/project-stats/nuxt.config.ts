export default defineNuxtConfig({
  $meta: {
    name: 'project-stats',
  },

  extends: ['../../core'],

  alias: {
    '#layers/project-stats': import.meta.dirname,
    '#layers/project-stats/shared': `${import.meta.dirname}/shared`,
  },

  compatibilityDate: '2026-10-27',

  runtimeConfig: {
    projectStatsLayer: {
      // Optional: unauthenticated GitHub requests are limited to 60/hour per server IP
      githubToken: '', // env: NUXT_PROJECT_STATS_LAYER_GITHUB_TOKEN
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    projectStatsLayer?: {
      githubToken: string
    }
  }
}
