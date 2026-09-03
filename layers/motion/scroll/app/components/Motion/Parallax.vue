<script setup lang="ts">
  const {
    speed = 0.5,
    direction = 'vertical',
    rotate = 0,
    scale = 0,
    scrub = 0.5,
    as = 'div',
  } = defineProps<{
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
  }>()

  const { gsap } = useGsap()

  const containerRef = useTemplateRef<HTMLElement | null>('containerRef')
  const contentRef = useTemplateRef<HTMLElement | null>('contentRef')

  onMounted(() => {
    if (!containerRef.value || !contentRef.value) return

    const yAmount = direction === 'vertical' ? speed * -200 : 0
    const xAmount = direction === 'horizontal' ? speed * 200 : 0

    const animationProps: gsap.TweenVars = {
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrub,
      },
      ease: 'none',
    }

    if (yAmount !== 0) animationProps.y = yAmount
    if (xAmount !== 0) animationProps.x = xAmount
    if (rotate !== 0) animationProps.rotation = rotate
    if (scale !== 0) animationProps.scale = 1 + scale

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
