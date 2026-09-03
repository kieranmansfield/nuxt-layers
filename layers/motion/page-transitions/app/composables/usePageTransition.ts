/**
 * Set the page transition for the current page programmatically.
 * Call inside a page component's setup() to override the default transition.
 *
 * @example
 * usePageTransition('slide')
 */
export function usePageTransition(name?: string) {
  const appConfig = useAppConfig()
  const route = useRoute()
  const pageTransitions = appConfig.pageTransitions as
    | { default?: string; duration?: number }
    | undefined

  const currentTransition = useState('page-transition:current', () => ({
    name: pageTransitions?.default ?? 'fade',
    duration: pageTransitions?.duration ?? 300,
  }))

  if (name) {
    currentTransition.value.name = name
  }

  const transitionName = computed(() => currentTransition.value.name)
  const duration = computed(() => currentTransition.value.duration)

  if (import.meta.client) {
    watchEffect(() => {
      document.documentElement.style.setProperty(
        '--page-transition-duration',
        `${duration.value}ms`
      )
    })
  }

  function setTransition(transitionName: string, transitionDuration?: number) {
    currentTransition.value.name = transitionName
    if (transitionDuration !== undefined) {
      currentTransition.value.duration = transitionDuration
    }
  }

  return { transitionName, duration, setTransition, route }
}
