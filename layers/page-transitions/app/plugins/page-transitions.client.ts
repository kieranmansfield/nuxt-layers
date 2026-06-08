/* eslint-disable no-restricted-syntax */
export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()

  const defaultTransition = appConfig.pageTransitions?.default ?? 'fade'
  const duration = appConfig.pageTransitions?.duration ?? 300

  nuxtApp.hook('page:start', () => {
    useState('page-transition:current').value = {
      name: defaultTransition,
      duration,
    }
  })
})
