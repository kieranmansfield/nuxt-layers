// import { useTheme } from '../composables/themestore'

// export default defineNuxtPlugin(() => {
//   const themeStore = useTheme()
//   themeStore.initTheme()

//   // Watch for theme changes and update document attributes
//   watch(
//     () => themeStore.currentTheme,
//     (theme) => {
//       document.documentElement.setAttribute('data-theme', theme)
//       window.localStorage.setItem('theme', theme)
//     },
//     { immediate: true }
//   )
// })
