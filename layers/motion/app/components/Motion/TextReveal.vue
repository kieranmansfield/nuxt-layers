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
     * Trigger on scroll
     */
    scrollTrigger?: boolean
    /**
     * Start position for scroll trigger
     */
    start?: string
  }>(),
  {
    type: 'chars',
    stagger: 0.03,
    duration: 0.8,
    scrollTrigger: true,
    start: 'top 80%',
  }
)

const { gsap } = useGsap()
const containerRef = ref<HTMLElement | null>(null)

const splitContent = computed(() => {
  if (props.type === 'chars') {
    return props.text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
  } else if (props.type === 'words') {
    return props.text.split(' ')
  }
  return [props.text]
})

onMounted(() => {
  if (!containerRef.value) return

  const elements = containerRef.value.querySelectorAll('.reveal-item')

  const animationConfig: gsap.TweenVars = {
    y: 40,
    opacity: 0,
    rotateX: -90,
    duration: props.duration,
    stagger: props.stagger,
    ease: 'power3.out',
  }

  if (props.scrollTrigger) {
    animationConfig.scrollTrigger = {
      trigger: containerRef.value,
      start: props.start,
      toggleActions: 'play none none none',
    }
  }

  gsap.from(elements, animationConfig)
})
</script>

<template>
  <span ref="containerRef" class="motion-text-reveal">
    <span
      v-for="(item, index) in splitContent"
      :key="index"
      class="reveal-item"
      :class="{ 'mr-[0.25em]': type === 'words' && index < splitContent.length - 1 }"
    >
      {{ item }}
    </span>
  </span>
</template>

<style scoped>
.motion-text-reveal {
  display: inline-flex;
  flex-wrap: wrap;
  perspective: 1000px;
}

.reveal-item {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform, opacity;
}
</style>
