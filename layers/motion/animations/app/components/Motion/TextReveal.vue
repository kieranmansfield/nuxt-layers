<script setup lang="ts">
  const {
    type = 'chars',
    stagger = 0.03,
    duration = 0.8,
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
     * Stagger delay between elements
     */
    stagger?: number
    /**
     * Animation duration
     */
    duration?: number
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
    stagger: stagger,
    duration: duration,
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
