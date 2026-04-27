import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
  motion: {
    /**
     * Enable smooth scroll globally (true), on specific routes (string[]), or disable (false).
     * @default true
     */
    smoothScroll: true,

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
