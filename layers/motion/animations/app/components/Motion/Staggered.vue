<script setup lang="ts">
  // Explicit import so Staggered mounts under vitest's 'vue' project (no Nuxt auto-imports)
  // — same exemption as ElementTw.vue (eslint.config.mjs).
  import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

  const {
    staggerDelay = 100,
    initialDelay = 0,
    animation = 'fade-in',
  } = defineProps<{
    staggerDelay?: number
    initialDelay?: number
    /**
     * Suffix of a `transitions` layer `animate-*` class (e.g. 'fade-in', 'slide-in-up').
     */
    animation?: string
  }>()

  // Stagger the rendered DOM children, not slot vnodes: a `ref`/`class` on `<slot>` becomes a
  // slot prop and never reaches an element, which left every item hidden for good.
  const reduced = useReducedMotion()
  const root = useTemplateRef<HTMLElement>('root')
  const timers: ReturnType<typeof setTimeout>[] = []

  onMounted(() => {
    const items = [...(root.value?.children ?? [])]
    if (reduced.value) {
      root.value?.setAttribute('data-reduced', '')
      return items.forEach((item) => item.classList.add('animated'))
    }
    items.forEach((item, index) => {
      timers.push(
        setTimeout(
          () => item.classList.add(`animate-${animation}`, 'animated'),
          initialDelay + index * staggerDelay
        )
      )
    })
  })

  onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div ref="root" class="motion-staggered">
    <slot />
  </div>
</template>

<style scoped>
  /* stylelint-disable selector-pseudo-class-no-unknown */
  .motion-staggered > :deep(*) {
    transform: translateY(20px);
    opacity: 0;
    transition:
      opacity 0.3s ease-out,
      transform 0.3s ease-out;
  }

  .motion-staggered > :deep(.animated) {
    transform: translateY(0);
    opacity: 1;
  }

  .motion-staggered[data-reduced] > :deep(*) {
    transition: none;
  }
</style>
