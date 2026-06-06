import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Provides access to GSAP and ScrollTrigger.
 * Registration is handled by v-gsap-nuxt.
 *
 * @example
 * const { gsap, ScrollTrigger } = useGsap()
 */
export function useGsap() {
  return { gsap, ScrollTrigger }
}
