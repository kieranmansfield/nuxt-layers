import type { ILocomotiveScrollOptions } from 'locomotive-scroll'

export default defineAppConfig({
  scroll: {
    smoothScroll: true as boolean | string[],
    // Merged over the plugin's stock Lenis defaults (lerp 0.1, smoothWheel, wheelMultiplier 1)
    lenisOptions: {} as NonNullable<ILocomotiveScrollOptions['lenisOptions']>,
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    scroll?: {
      smoothScroll?: boolean | string[]
      lenisOptions?: ILocomotiveScrollOptions['lenisOptions']
    }
  }
}
