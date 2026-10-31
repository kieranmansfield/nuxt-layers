import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Flip)

/**
 * Provides access to GSAP, ScrollTrigger and Flip.
 * ScrollTrigger is registered by v-gsap-nuxt; Flip is registered here (idempotent).
 *
 * @example
 * const { gsap, ScrollTrigger, Flip } = useGsap()
 */
export function useGsap() {
  return { gsap, ScrollTrigger, Flip }
}
