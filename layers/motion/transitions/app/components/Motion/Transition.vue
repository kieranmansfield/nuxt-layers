<script setup lang="ts">
  import type { MotionPreset } from '#layers/core/app/types/motion'
  import type { MotionDuration, MotionEase } from '#layers/core/app/types/tokens'

  /**
   * Plays one entrance preset on its content, on mount or when it scrolls into view.
   * The from/to states live in transitions.css (shared with MotionStaggered); this only
   * flips `data-state` and sets the timing. Server-rendered content is visible at rest,
   * and reduced motion shows it without moving.
   */
  const {
    preset = 'fade',
    duration = 300,
    delay = 0,
    ease = 'out',
    trigger = 'mount',
    as = 'div',
  } = defineProps<{
    preset?: MotionPreset
    /** Milliseconds, or a duration token */
    duration?: MotionDuration | number
    /** Milliseconds */
    delay?: number
    /** An ease token, or any CSS easing */
    ease?: MotionEase | (string & {})
    /** `visible` waits until the element scrolls into view */
    trigger?: 'mount' | 'visible'
    as?: string
  }>()

  const el = useTemplateRef<HTMLElement>('el')
  const state = ref<'from' | 'to'>('from')
  const reduced = useReducedMotion()

  const style = computed(() => ({
    transitionDuration: `${resolveDurationMs(duration)}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: resolveEaseCss(ease),
  }))

  // Two frames, so the browser paints the "from" state before the transition starts
  function play() {
    requestAnimationFrame(() => requestAnimationFrame(() => (state.value = 'to')))
  }

  onMounted(() => {
    if (reduced.value || trigger === 'mount') return play()
    const { stop } = useIntersectionObserver(el, ([entry]) => {
      if (!entry?.isIntersecting) return
      stop()
      play()
    })
  })
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="motion-transition"
    :data-motion-preset="preset"
    :data-state="state"
    :style
  >
    <slot />
  </component>
</template>
