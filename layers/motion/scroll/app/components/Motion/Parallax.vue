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
  const reduced = useReducedMotion()

  const containerRef = useTemplateRef<HTMLElement | null>('containerRef')
  const contentRef = useTemplateRef<HTMLElement | null>('contentRef')

  let tween: gsap.core.Tween | null = null

  onMounted(() => {
    if (!containerRef.value || !contentRef.value) return
    // ponytail: checked once at mount — a later reduced-motion toggle applies on next mount/reload; re-run set-up in a watch if live toggling matters
    if (reduced.value) return

    tween = gsap.to(contentRef.value, {
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
      ease: 'none',
      ...parallaxMotionVars({ speed, direction, rotate, scale }),
    })
  })

  onUnmounted(() => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
  })
</script>

<template>
  <component :is="as" ref="containerRef" class="motion-parallax">
    <div ref="contentRef" class="motion-parallax-content will-change-transform">
      <slot />
    </div>
  </component>
</template>
