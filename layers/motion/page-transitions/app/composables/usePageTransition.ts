import type { PageTransitionChoice } from '../types'

/**
 * Reactive page-transition state. `transitionName`/`duration` are the preset in use for the
 * current navigation; `setTransition()` queues a one-shot override for the NEXT navigation.
 *
 * @example
 * const { setTransition } = usePageTransition()
 * setTransition('curved', 700)
 * await navigateTo('/about')
 */
export function usePageTransition(name?: string) {
  const config = useAppConfig().pageTransitions
  const route = useRoute()

  const current = useState('page-transition:current', () => ({
    name: config?.default ?? 'fade',
    duration: config?.duration ?? 300,
  }))
  const next = useState<PageTransitionChoice | null>('page-transition:next', () => null)

  function setTransition(transitionName: string, transitionDuration?: number) {
    next.value = { name: transitionName, duration: transitionDuration }
  }

  if (name) setTransition(name)

  return {
    transitionName: computed(() => current.value.name),
    duration: computed(() => current.value.duration),
    setTransition,
    route,
  }
}
