/**
 * GSAP composable - provides access to GSAP and ScrollTrigger
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
  const nuxtApp = useNuxtApp()

  return {
    gsap: nuxtApp.$gsap as unknown as typeof import('gsap').gsap,
    ScrollTrigger: nuxtApp.$ScrollTrigger as unknown as typeof import('gsap/ScrollTrigger').ScrollTrigger,
  }
}
