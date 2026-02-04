import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
// import { SplitText } from 'gsap/SplitText'

export default defineNuxtPlugin(() => {
  // gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText)
  gsap.registerPlugin(ScrollTrigger)

  return {
    provide: {
      gsap,
      ScrollTrigger,
      // ScrambleTextPlugin,
      // SplitText,
    },
  }
})
