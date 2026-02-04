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
  // Reactive scroll state that will be updated via scrollCallback
  const scrollState = reactive<ScrollState>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  })

  // Create Locomotive Scroll instance
  const locomotiveScroll = new LocomotiveScroll({
    // Lenis options passthrough (LS5 is built on Lenis)
    lenisOptions: {
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    },
    // Scroll callback for reactive state updates and GSAP sync
    scrollCallback: ({ scroll, limit, velocity, direction, progress }) => {
      scrollState.scroll = scroll
      scrollState.limit = limit
      scrollState.velocity = velocity
      scrollState.direction = direction
      scrollState.progress = progress

      // Sync ScrollTrigger with Locomotive Scroll
      ScrollTrigger.update()
    },
  })

  return {
    provide: {
      locomotiveScroll,
      scrollState,
    },
  }
})
