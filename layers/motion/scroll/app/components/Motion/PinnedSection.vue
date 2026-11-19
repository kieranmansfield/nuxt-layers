<script setup lang="ts">
  const { duration = 200, scrub = 0.5 } = defineProps<{
    /**
     * Pin duration as a percentage of viewport height (200 = 2× viewport height)
     */
    duration?: number
    /**
     * Scrub smoothness for card reveals
     */
    scrub?: number
  }>()

  const { gsap, ScrollTrigger } = useGsap()
  const reduced = useReducedMotion()

  const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
  const contentRef = useTemplateRef<HTMLElement>('contentRef')

  const cleanups: Array<() => void> = []

  // Reduced motion: no pin, no reveal — show every child at rest (inline style beats the
  // first-paint hide rule below).
  // ponytail: checked once at mount — a later reduced-motion toggle applies on next mount/reload
  onMounted(() => {
    const section = sectionRef.value
    const content = contentRef.value
    if (!section || !content) return
    const items = Array.from(content.querySelectorAll(':scope > *'))
    if (reduced.value) return void gsap.set(items, { opacity: 1, y: 0, scale: 1 })
    pinAndReveal(section, items)
  })

  function pinAndReveal(section: HTMLElement, items: Element[]) {
    const endValue = `+=${(duration * window.innerHeight) / 100}`

    // Pin the section
    const pinSt = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: endValue,
      pin: true,
      pinSpacing: true,
    })
    cleanups.push(() => pinSt.kill())

    // Animate each direct child
    const total = items.length
    items.forEach((item, i) => {
      gsap.set(item, { opacity: 0, y: 60, scale: 0.9 })

      const startProgress = i / total
      const endProgress = (i + 0.5) / total

      const tween = gsap.to(item, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: endValue,
          scrub,
        },
        keyframes: [
          { opacity: 0, y: 60, scale: 0.9, duration: startProgress },
          { opacity: 1, y: 0, scale: 1, duration: endProgress - startProgress },
          { opacity: 1, y: 0, scale: 1, duration: 1 - endProgress },
        ],
        ease: 'none',
      })
      cleanups.push(() => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    })
  }

  onUnmounted(() => {
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
  })
</script>

<template>
  <section ref="sectionRef" class="motion-pinned-section relative h-screen">
    <div ref="contentRef" class="motion-pinned-content flex h-full items-center justify-center">
      <slot />
    </div>
  </section>
</template>

<style scoped>
  /* Match gsap.set()'s initial state (opacity:0, y:60, scale:0.9) so the SSR/first-paint
     frame is already hidden — GSAP then animates from this state instead of visibly
     snapping into it post-mount, which reads as a layout shift. */
  .motion-pinned-content > :deep(*) {
    transform: translateY(60px) scale(0.9);
    opacity: 0;
  }
</style>
