export default defineNuxtPlugin({
  name: 'page-transitions:page-transitions',
  setup(nuxtApp) {
    const appConfig = useAppConfig()

    const defaultTransition = appConfig.pageTransitions?.default ?? 'fade'
    const duration = appConfig.pageTransitions?.duration ?? 300

    nuxtApp.hook('page:start', () => {
      useState('page-transition:current').value = {
        name: defaultTransition,
        duration,
      }
    })
  },
})
