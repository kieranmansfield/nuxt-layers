/* eslint-disable no-restricted-syntax */
// Conditionally load nuxt-studio if installed (optional peer dependency) and in development
const studioModule: string[] = []
if (process.env.NODE_ENV === 'development') {
  try {
    await import('nuxt-studio')
    studioModule.push('nuxt-studio')
  } catch {}
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'content',
  },

  extends: ['../core'],

  alias: {
    '#layers/content': import.meta.dirname,
    '#layers/content/types': `${import.meta.dirname}/app/types`,
  },

  modules: ['@nuxt/ui', '@nuxt/content', ...studioModule],

  // Configure @nuxt/content for production/Netlify builds
  content: {
    // Disable local database for production builds to avoid better-sqlite3 native module issues
    // database: process.env.NETLIFY || process.env.NODE_ENV === 'production' ? false : {},
    experimental: {
      nativeSqlite: true,
    },
  },

  css: ['#layers/content/app/assets/css/content.css'],

  compatibilityDate: '2026-01-24',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
