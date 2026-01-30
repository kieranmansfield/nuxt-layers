export default defineAppConfig({
  motion: {
    /**
     * Animation library: 'gsap' | 'vueuse-motion'
     * @default 'gsap'
     */
    animationLibrary: 'gsap',

    /**
     * Scroll library: 'lenis' | 'locomotive' | 'native'
     * @default 'lenis'
     */
    scrollLibrary: 'lenis',

    /**
     * Enable GSAP ScrollTrigger integration
     * @default true
     */
    gsapScrollTrigger: true,

    /**
     * Lenis configuration (used when scrollLibrary is 'lenis')
     */
    lenis: {
      duration: 1.2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    },

    /**
     * Locomotive Scroll configuration (used when scrollLibrary is 'locomotive')
     */
    locomotive: {
      smooth: true,
      multiplier: 1,
      lerp: 0.1,
    },
  },
})
