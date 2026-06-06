export default defineAppConfig({
  scroll: {
    smoothScroll: true as boolean | string[],
    gsapScrollTrigger: true,
    lenis: {
      duration: 1.2,
      orientation: 'vertical' as 'vertical' | 'horizontal',
      gestureOrientation: 'vertical' as 'vertical' | 'horizontal',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    scroll?: {
      smoothScroll?: boolean | string[]
      gsapScrollTrigger?: boolean
      lenis?: {
        duration?: number
        orientation?: 'vertical' | 'horizontal'
        gestureOrientation?: 'vertical' | 'horizontal'
        smoothWheel?: boolean
        smoothTouch?: boolean
        touchMultiplier?: number
      }
    }
  }
}
