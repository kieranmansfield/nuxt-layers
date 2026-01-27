export default defineNuxtPlugin((nuxtApp) => {
  const { logError } = useErrorLog()

  // Global Vue error handler
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Get component name for context
    const componentName =
      instance?.$options?.name || instance?.$options?.__name || 'Unknown Component'

    // Log error with context
    logError(error, {
      component: componentName,
      info: String(info),
      type: 'vue-error',
    })
  }

  // Nuxt-specific error hook (catches errors during SSR, routing, etc.)
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // Get component name for context
    const componentName =
      instance?.$options?.name || instance?.$options?.__name || 'Unknown Component'

    // Log error with context
    logError(error, {
      component: componentName,
      info: String(info),
      type: 'nuxt-error',
    })
  })

  // Handle app initialization errors
  nuxtApp.hook('app:error', (error) => {
    logError(error, {
      type: 'app-error',
      info: 'Application initialization error',
    })
  })

  // Handle page errors
  nuxtApp.hook('app:error:cleared', () => {
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.log('✅ Error cleared')
    }
  })
})
