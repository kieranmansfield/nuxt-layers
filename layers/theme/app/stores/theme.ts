import { defineStore } from 'pinia'

// IMPORTANT: Do NOT use Pinia persistence plugins for this store.
// Only the theme name string should ever be stored in localStorage under the key 'theme'.

type ThemeMap = Record<string, Record<string, string>>

interface AppConfig {
  ui: {
    themes: ThemeMap
    colors: Record<string, string>
    // ...other properties
  }
  // ...other properties
}

// Make sure useAppConfig returns AppConfig
declare function useAppConfig(): AppConfig

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'blue' as string,
    themes: [] as string[],
    defaultTheme: 'blue' as string,
  }),
  actions: {
    initTheme() {
      const appConfig = useAppConfig()
      this.themes = Object.keys(appConfig.ui.themes)
      this.defaultTheme = this.themes[0] || this.defaultTheme
      const storedTheme =
        typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
      let themeToUse =
        storedTheme && this.themes.includes(storedTheme) ? storedTheme : this.defaultTheme
      if (typeof window !== 'undefined' && (!storedTheme || !this.themes.includes(storedTheme))) {
        window.localStorage.setItem('theme', this.defaultTheme)
        themeToUse = this.defaultTheme
      }
      this.currentTheme = themeToUse
      Object.assign(appConfig.ui.colors, appConfig.ui.themes[themeToUse])
    },
    setTheme(theme: string) {
      if (!theme || typeof theme !== 'string') return
      if (this.themes.includes(theme)) {
        this.currentTheme = theme
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('theme', theme)
          document.documentElement.setAttribute('data-theme', theme)
        }
        const appConfig = useAppConfig()
        Object.assign(appConfig.ui.colors, appConfig.ui.themes[theme])
      }
    },
    loadThemes() {
      const appConfig = useAppConfig()
      this.themes = Object.keys(appConfig.ui.themes)
    },
    loadTheme() {
      const appConfig = useAppConfig()
      this.loadThemes()
      const storedTheme =
        typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
      // const theme = storedTheme && this.themes.includes(storedTheme) ? storedTheme : this.themes[0]
      const theme =
        storedTheme && this.themes.includes(storedTheme) ? storedTheme : this.defaultTheme

      this.currentTheme = theme
      Object.assign(appConfig.ui.colors, appConfig.ui.themes[theme])
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
      }
      // Do NOT write to localStorage here
    },
    watchThemeSync() {
      // Watch currentTheme and sync appConfig
      watch(
        () => this.currentTheme,
        (theme) => {
          if (this.themes.includes(theme)) {
            const appConfig = useAppConfig()
            Object.assign(appConfig.ui.colors, appConfig.ui.themes[theme])
            document.documentElement.setAttribute('data-theme', theme)
            window.localStorage.setItem('theme', theme)
          }
        },
        { immediate: true }
      )
    },
  },
})
