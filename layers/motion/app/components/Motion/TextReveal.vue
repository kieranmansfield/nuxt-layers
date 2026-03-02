<script setup lang="ts">
const props = withDefaults(
  defineProps<{
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
  }>(),
  { type: 'chars', stagger: 0.03, duration: 0.8, start: 'top 80%' }
)

const animBinding = computed(() => ({
  y: 40,
  opacity: 0,
  rotateX: -90,
  stagger: props.stagger,
  duration: props.duration,
  ease: 'power3.out',
  start: props.start,
}))
</script>

<template>
  <span v-if="type === 'chars'" v-gsap.whenVisible.once.splitText.chars.from="animBinding" class="motion-text-reveal">{{ text }}</span>
  <span v-else-if="type === 'words'" v-gsap.whenVisible.once.splitText.words.from="animBinding" class="motion-text-reveal">{{ text }}</span>
  <span v-else v-gsap.whenVisible.once.splitText.lines.from="animBinding" class="motion-text-reveal">{{ text }}</span>
</template>

<style scoped>
.motion-text-reveal {
  display: inline-flex;
  flex-wrap: wrap;
  perspective: 1000px;
}
</style>
