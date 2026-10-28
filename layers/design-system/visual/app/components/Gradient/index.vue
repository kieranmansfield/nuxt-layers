<script setup lang="ts">
  import type { GradientConfig } from '../../types/gradient'

  // One component for both gradient surfaces (v7 merged GradientBackground and GradientText):
  // `target` picks whether the gradient fills the box or is clipped to the text.
  const {
    preset = undefined,
    config = undefined,
    target = 'background',
    as = undefined,
  } = defineProps<{
    preset?: string
    config?: GradientConfig
    target?: 'background' | 'text'
    /** Defaults to `div` for a background and `span` for text. */
    as?: string
  }>()

  const { style } = useGradient(computed(() => preset ?? config ?? 'brand'))

  const element = computed(() => as ?? (target === 'text' ? 'span' : 'div'))
</script>

<template>
  <ElementTw
    :as="element"
    :component-props="{ style, class: target === 'text' && 'gradient-text inline-block' }"
  >
    <slot />
  </ElementTw>
</template>
