import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'

import type { ScrollState } from '../types/scroll'

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
    const { screen } = useLoading()

    // Under the loading screen Lenis must be stopped, not just left un-started: an unstopped
    // Lenis still takes wheel/touch input and replays it as a jump once it starts
    function holdForLoadingScreen(scroll: LocomotiveScroll) {
      if (screen.value === 'visible') scroll.lenisInstance?.stop()
    }

    function init() {
      if (instance.value) return
      instance.value = new LocomotiveScroll({
        // Under core's boot loading screen, wait for its exit to start (watcher below)
        autoStart: screen.value !== 'visible',
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
      holdForLoadingScreen(instance.value)

      // ScrollTriggers created before Lenis exists (page:finish can fire first)
      // refresh against a null instance — remeasure once real layout settles.
      requestAnimationFrame(() => ScrollTrigger.refresh())
      document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    }

    function destroy() {
      instance.value?.destroy()
      instance.value = null
    }

    // Hold motion until core's boot loading screen reveals the page: GSAP stays paused while the
    // screen is up, so entrance animations play once it's gone; scrolling unlocks as it exits.
    // Without a mounted screen the state stays 'hidden' and GSAP is never touched.
    watch(
      screen,
      (state, previous) => {
        gsap.globalTimeline.paused(state !== 'hidden')

        // Start as the screen leaves, or once it's gone if it skipped 'leaving' (finishNow)
        if (state === 'visible' || previous === 'leaving') return
        instance.value?.start()
        // Remeasure once the screen's scroll lock is off the page
        requestAnimationFrame(() => {
          instance.value?.resize()
          ScrollTrigger.refresh()
        })
      },
      { immediate: screen.value !== 'hidden' }
    )

    const router = useRouter()
    const appConfig = useAppConfig()
    const scrollConfig = appConfig.scroll as { smoothScroll?: boolean | string[] } | undefined
    const smoothScroll: boolean | string[] = scrollConfig?.smoothScroll ?? true

    const nuxtApp = useNuxtApp()

    if (smoothScroll === true) {
      nuxtApp.hook('app:mounted', () => nextTick(init))
      nuxtApp.hook('page:finish', () =>
        nextTick(() => {
          instance.value?.scrollTo(0, { immediate: true })
          ScrollTrigger.refresh()
        })
      )
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
