import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  // Provide GSAP globally
  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
