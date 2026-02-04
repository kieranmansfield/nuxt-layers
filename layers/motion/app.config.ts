export default defineAppConfig({
  motion: {
    /**
     * Enable GSAP ScrollTrigger integration with Lenis
     * @default true
     */
    gsapScrollTrigger: true,

    /**
     * Lenis smooth scroll configuration
     */
    lenis: {
      duration: 1.2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    },
  },
})
