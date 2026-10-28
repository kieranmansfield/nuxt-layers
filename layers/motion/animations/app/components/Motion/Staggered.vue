<script setup lang="ts">
  // Explicit import so Staggered mounts under vitest's 'vue' project (no Nuxt auto-imports)
  // — same exemption as ElementTw.vue (eslint.config.mjs).
  import { onMounted, useTemplateRef } from 'vue'

  import type { MotionPreset } from '#layers/core/app/types/motion'
  import type { MotionDuration } from '#layers/core/app/types/tokens'
  import { resolveDurationMs } from '#layers/core/app/utils/motion'

  /**
   * Reveals its direct children one after another with a shared entrance preset (the same
   * presets as MotionTransition, from transitions.css). Children are visible at rest when
   * rendered on the server; reduced motion shows them without moving.
   */
  const {
    preset = 'fade',
    duration = 300,
    stagger = 100,
    delay = 0,
  } = defineProps<{
    preset?: MotionPreset
    /** Each child's animation: milliseconds, or a duration token */
    duration?: MotionDuration | number
    /** Milliseconds between children */
    stagger?: number
    /** Milliseconds before the first child */
    delay?: number
  }>()

  // Stagger the rendered DOM children, not slot vnodes: a `ref`/`class` on `<slot>` becomes a
  // slot prop and never reaches an element, which left every item hidden for good.
  const reduced = useReducedMotion()
  const root = useTemplateRef<HTMLElement>('root')

  onMounted(() => {
    const el = root.value
    if (!el) return
    if (!reduced.value) {
      ;[...el.children].forEach((item, index) => {
        const child = item as HTMLElement
        child.style.animationDelay = `${delay + index * stagger}ms`
        child.classList.add('motion-enter')
      })
    }
    el.dataset.ready = ''
  })
</script>

<template>
  <div
    ref="root"
    class="motion-staggered"
    :data-motion-preset="preset"
    :style="{ '--motion-duration': `${resolveDurationMs(duration)}ms` }"
  >
    <slot />
  </div>
</template>
