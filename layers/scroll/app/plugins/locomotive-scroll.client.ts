import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'

export type ScrollState = {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

export default defineNuxtPlugin({
  name: 'scroll:locomotive-scroll',
  setup() {
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
    const appConfig = useAppConfig()
    const smoothScroll: boolean | string[] = appConfig.scroll?.smoothScroll ?? true

    const nuxtApp = useNuxtApp()

    if (smoothScroll === true) {
      nuxtApp.hook('app:mounted', () => nextTick(init))
      nuxtApp.hook('page:finish', () => nextTick(() => ScrollTrigger.refresh()))
    } else if (Array.isArray(smoothScroll)) {
      addRouteMiddleware((to, from) => {
        if (smoothScroll.includes(to.path)) {
          nextTick(init)
        } else if (from?.path && smoothScroll.includes(from.path)) {
          destroy()
        }
      })
      if (smoothScroll.includes(router.currentRoute.value.path)) {
        nuxtApp.hook('app:mounted', () => nextTick(init))
      }
    }

    return {
      provide: {
        locomotiveScroll: instance,
        scrollState,
      },
    }
  },
})
