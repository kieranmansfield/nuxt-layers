import { useLenis } from 'lenis/vue'
export const useScroll = () => {
  const lenisRef = useLenis()

  function lockScrolling() {
    document.documentElement.style.overflow = 'hidden'
    if (lenisRef.value) lenisRef.value.stop()
    // console.log('scrolling locked')
  }

  function unlockScrolling() {
    document.documentElement.style.overflow = ''
    if (lenisRef.value) lenisRef.value.start()
    // console.log('scrolling unlocked')
  }

  function scrollToTop() {
    if (lenisRef.value) lenisRef.value.scrollTo(0, { duration: 2 })
    // console.log('scrolling to top')
  }

  function snapToTop() {
    if (lenisRef.value) lenisRef.value.scrollTo(0, { immediate: true })
    // console.log('snapped to top')
  }

  return { lockScrolling, unlockScrolling, scrollToTop, snapToTop }
}
