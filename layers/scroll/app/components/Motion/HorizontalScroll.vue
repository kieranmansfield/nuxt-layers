<script setup lang="ts">
const { scrub = 1 } = defineProps<{
  /**
   * Scrub smoothness (1 = default, higher = smoother/slower)
   */
  scrub?: number
}>()

const emit = defineEmits<{
  'panel-change': [index: number]
}>()

const { gsap } = useGsap()

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

let cleanup: (() => void) | null = null

onMounted(() => {
  if (!sectionRef.value || !trackRef.value) return

  const track = trackRef.value
  const trackWidth = track.scrollWidth - window.innerWidth

  const tween = gsap.to(track, {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: `+=${trackWidth}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      onUpdate: (self) => {
        const panels = track.querySelectorAll(':scope > *')
        if (panels.length > 0) {
          const index = Math.round(self.progress * (panels.length - 1))
          emit('panel-change', index)
        }
      },
    },
    x: -trackWidth,
    ease: 'none',
  })

  cleanup = () => tween.kill()
})

onUnmounted(() => {
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <section ref="sectionRef" class="motion-horizontal-scroll h-screen overflow-hidden">
    <div ref="trackRef" class="h-full flex items-center will-change-transform">
      <slot />
    </div>
  </section>
</template>
