<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * Parallax speed (-1 to 1, negative = slower than scroll)
     */
    speed?: number
    /**
     * Direction of parallax movement
     */
    direction?: 'vertical' | 'horizontal'
    /**
     * Enable rotation during parallax
     */
    rotate?: number
    /**
     * Enable scale during parallax
     */
    scale?: number
    /**
     * Scrub smoothness (0.1 = very smooth, 1 = instant)
     */
    scrub?: number
    /**
     * Tag to render as
     */
    as?: string
  }>(),
  {
    speed: 0.5,
    direction: 'vertical',
    rotate: 0,
    scale: 0,
    scrub: 0.5,
    as: 'div',
  }
)

const { gsap, ScrollTrigger } = useGsap()

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!containerRef.value || !contentRef.value) return

  const yAmount = props.direction === 'vertical' ? props.speed * -200 : 0
  const xAmount = props.direction === 'horizontal' ? props.speed * 200 : 0

  const animationProps: gsap.TweenVars = {
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: props.scrub,
    },
    ease: 'none',
  }

  if (yAmount !== 0) animationProps.y = yAmount
  if (xAmount !== 0) animationProps.x = xAmount
  if (props.rotate !== 0) animationProps.rotation = props.rotate
  if (props.scale !== 0) animationProps.scale = 1 + props.scale

  gsap.to(contentRef.value, animationProps)
})
</script>

<template>
  <component :is="as" ref="containerRef" class="motion-parallax">
    <div ref="contentRef" class="motion-parallax-content will-change-transform">
      <slot />
    </div>
  </component>
</template>
