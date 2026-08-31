export default defineNuxtConfig({
  extends: [
    '../../layers/core',
    '../../layers/typography',
    '../../layers/navigation',
    '../../layers/visual',
    '../../layers/theming',
  ],

  modules: ['@nuxt/fonts'],

  // Phase 5 pilot (nuxt-declarative-layout-system-spec.md §21) — this is the
  // smallest Nuxt UI consumer, chosen as the test bed for the unstyled theme
  // before any wider rollout. Deep-merges over layers/core's default (styled)
  // registration since this app's own nuxt.config wins. Verify visually via
  // `pnpm dev:identity` before extending to any other app.
  ui: {
    theme: {
      unstyled: true,
    },
  },

  fonts: {
    families: [{ name: 'Roboto Flex', provider: 'google' }],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-01-24',
})
