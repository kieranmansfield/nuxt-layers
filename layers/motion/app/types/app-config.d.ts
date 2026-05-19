declare module '@nuxt/schema' {
  interface AppConfigInput {
    motion?: {
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
