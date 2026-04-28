import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Provides access to GSAP and ScrollTrigger.
 * Registration is handled by v-gsap-nuxt.
 *
 * @example
 * const { gsap, ScrollTrigger } = useGsap()
 *
 * gsap.to('.element', {
 *   scrollTrigger: { trigger: '.element', start: 'top center' },
 *   opacity: 1,
 *   y: 0,
 * })
 */
export function useGsap() {
  return { gsap, ScrollTrigger }
}
