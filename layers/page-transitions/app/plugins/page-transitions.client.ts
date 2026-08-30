export default defineNuxtPlugin({
  name: 'page-transitions:page-transitions',
  setup(nuxtApp) {
    const appConfig = useAppConfig()
    const pageTransitions = appConfig.pageTransitions as
      | { default?: string; duration?: number }
      | undefined

    const defaultTransition = pageTransitions?.default ?? 'fade'
    const duration = pageTransitions?.duration ?? 300

    nuxtApp.hook('page:start', () => {
      useState('page-transition:current').value = {
        name: defaultTransition,
        duration,
      }
    })
  },
})
