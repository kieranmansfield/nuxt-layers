<script setup lang="ts">
  import type { MotionDuration } from '#layers/core/app/types/tokens'

  const {
    type = 'chars',
    stagger = 30,
    duration = 800,
    start = 'top 80%',
  } = defineProps<{
    /**
     * Text to animate
     */
    text: string
    /**
     * Animation type
     */
    type?: 'chars' | 'words' | 'lines'
    /**
     * Milliseconds between each char, word or line
     */
    stagger?: number
    /**
     * Each piece's animation: milliseconds, or a duration token
     */
    duration?: MotionDuration | number
    /**
     * Start position for scroll trigger
     */
    start?: string
  }>()

  // Swapped to a plain span after mount: the server can't know the preference, so deciding in
  // render would mismatch on hydration.
  const reduced = useReducedMotion()
  const isStatic = ref(false)
  onMounted(() => (isStatic.value = reduced.value))

  const animBinding = computed(() => ({
    y: 40,
    opacity: 0,
    rotateX: -90,
    // GSAP takes seconds; the props are milliseconds like every other motion prop
    stagger: stagger / 1000,
    duration: resolveDurationMs(duration) / 1000,
    ease: 'power3.out',
    start: start,
  }))
</script>

<template>
  <span v-if="isStatic" class="motion-text-reveal">{{ text }}</span>
  <span
    v-else-if="type === 'chars'"
    v-gsap.whenVisible.once.splitText.chars.from="animBinding"
    class="motion-text-reveal"
    >{{ text }}</span
  >
  <span
    v-else-if="type === 'words'"
    v-gsap.whenVisible.once.splitText.words.from="animBinding"
    class="motion-text-reveal"
    >{{ text }}</span
  >
  <span
    v-else
    v-gsap.whenVisible.once.splitText.lines.from="animBinding"
    class="motion-text-reveal"
    >{{ text }}</span
  >
</template>

<style scoped>
  .motion-text-reveal {
    display: inline-flex;
    flex-wrap: wrap;
    perspective: 1000px;
  }
</style>
