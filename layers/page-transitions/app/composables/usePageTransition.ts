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

  const currentTransition = useState('page-transition:current', () => ({
    name: appConfig.pageTransitions?.default ?? 'fade',
    duration: appConfig.pageTransitions?.duration ?? 300,
  }))

  if (name) {
    currentTransition.value.name = name
  }

  const transitionName = computed(() => currentTransition.value.name)
  const duration = computed(() => currentTransition.value.duration)

  function setTransition(transitionName: string, transitionDuration?: number) {
    currentTransition.value.name = transitionName
    if (transitionDuration !== undefined) {
      currentTransition.value.duration = transitionDuration
    }
  }

  return { transitionName, duration, setTransition, route }
}
