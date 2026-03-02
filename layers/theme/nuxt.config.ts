// Theme Layer - Color mode, accent colors, accessibility preferences
export default defineNuxtConfig({
  $meta: {
    name: 'theme',
  },

  alias: {
    '#layers/theme': import.meta.dirname,
  },

  css: ['#layers/theme/app/assets/css/theme.css'],

  plugins: ['#layers/theme/app/plugins/theme.client.ts'],

  colorMode: {
    dataValue: 'theme-mode',
    storageKey: 'theme-mode',
  },

  appConfig: {
    ui: {
      colors: {
        primary: 'blue',
        secondary: 'indigo',
        info: 'sky',
      },
    },
    themeLayer: {
      accents: [
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ],
      defaultAccent: 'blue',
    },
  },

  compatibilityDate: '2026-01-30',
})
