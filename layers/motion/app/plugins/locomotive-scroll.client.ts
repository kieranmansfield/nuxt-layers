import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'

export interface ScrollState {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

export default defineNuxtPlugin(() => {
  const scrollState = reactive<ScrollState>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  })

  const instance = shallowRef<LocomotiveScroll | null>(null)

  function init() {
    if (instance.value) return
    instance.value = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
      },
      scrollCallback: ({ scroll, limit, velocity, direction, progress }) => {
        scrollState.scroll = scroll
        scrollState.limit = limit
        scrollState.velocity = velocity
        scrollState.direction = direction
        scrollState.progress = progress
        ScrollTrigger.update()
      },
    })
  }

  function destroy() {
    instance.value?.destroy()
    instance.value = null
  }

  const router = useRouter()

  const SMOOTH_SCROLL_ROUTES = ['/locomotive-scroll', '/layout-stacking', '/layout-blind-reveal']

  addRouteMiddleware((to, from) => {
    if (SMOOTH_SCROLL_ROUTES.includes(to.path)) {
      nextTick(init)
    } else if (from?.path && SMOOTH_SCROLL_ROUTES.includes(from.path)) {
      destroy()
    }
  })

  if (SMOOTH_SCROLL_ROUTES.includes(router.currentRoute.value.path)) {
    init()
  }

  return {
    provide: {
      locomotiveScroll: instance,
      scrollState,
    },
  }
})
