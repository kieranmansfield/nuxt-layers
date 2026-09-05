// Theme Layer - Color mode, accent colors, accessibility preferences
import { resolveUiColors } from './app/utils/themeAdapter'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    themeDefaultAccent?: string
  }
}

export default defineNuxtConfig({
  $meta: {
    name: 'theming',
  },

  extends: ['../../core'],

  runtimeConfig: {
    public: {
      themeDefaultAccent: 'blue',
    },
  },

  alias: {
    '#layers/theming': import.meta.dirname,
    '#layers/theming/types': `${import.meta.dirname}/app/types`,
  },

  // tokens.css is NOT listed here — it defines a Tailwind `@theme static` block, so per the
  // CSS single-build-root rule (see .claude/rules/nuxt-layers.md) it must fold into core.css's
  // @import chain via relative path instead, or its @theme block is silently inert.
  css: ['#layers/theming/app/assets/css/theme.css'],

  plugins: ['#layers/theming/app/plugins/theme.client.ts'],

  colorMode: {
    dataValue: 'theme-mode',
    storageKey: 'theme-mode',
  },

  appConfig: {
    ui: {
      colors: resolveUiColors('blue'),
    },
  },

  compatibilityDate: '2026-01-30',

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
