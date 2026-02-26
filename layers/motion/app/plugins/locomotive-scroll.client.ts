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

  let instance: LocomotiveScroll | null = null

  function init() {
    if (instance) return
    instance = new LocomotiveScroll({
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
    instance?.destroy()
    instance = null
  }

  const router = useRouter()

  // Only active on the locomotive-scroll route
  addRouteMiddleware((to, from) => {
    if (to.path === '/locomotive-scroll') {
      nextTick(init)
    } else if (from?.path === '/locomotive-scroll') {
      destroy()
    }
  })

  // Activate immediately if already on that route (e.g. hard refresh)
  if (router.currentRoute.value.path === '/locomotive-scroll') {
    init()
  }

  return {
    provide: {
      locomotiveScroll: readonly(instance),
      scrollState,
    },
  }
})
