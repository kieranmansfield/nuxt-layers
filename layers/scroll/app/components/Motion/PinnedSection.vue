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

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const cleanups: Array<() => void> = []

onMounted(() => {
  if (!sectionRef.value || !contentRef.value) return

  const endOffset = (duration * window.innerHeight) / 100
  const endValue = `+=${endOffset}`

  // Pin the section
  const pinSt = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: endValue,
    pin: true,
    pinSpacing: true,
  })
  cleanups.push(() => pinSt.kill())

  // Animate each direct child
  const items = Array.from(contentRef.value.querySelectorAll(':scope > *'))
  const total = items.length
  if (total === 0) return

  items.forEach((item, i) => {
    gsap.set(item, { opacity: 0, y: 60, scale: 0.9 })

    const startProgress = i / total
    const endProgress = (i + 0.5) / total

    const tween = gsap.to(item, {
      scrollTrigger: {
        trigger: sectionRef.value,
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
    cleanups.push(() => tween.kill())
  })
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups.length = 0
})
</script>

<template>
  <section ref="sectionRef" class="motion-pinned-section h-screen relative">
    <div ref="contentRef" class="h-full flex items-center justify-center">
      <slot />
    </div>
  </section>
</template>
