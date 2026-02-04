export const useGsap = () => {
  const nuxtApp = useNuxtApp()
  return {
    // this coming from gsap plugin, which will be also auto registered
    gsap: nuxtApp.$gsap as unknown as typeof import('gsap').gsap,
    ScrollTrigger:
      nuxtApp.$ScrollTrigger as unknown as typeof import('gsap/ScrollTrigger').ScrollTrigger,
    // ScrollToPlugin: nuxtApp.$ScrollToPlugin,
  }
}
