<script setup lang="ts">
  import type { GradientConfig } from '../../types/gradient'

  const {
    preset = undefined,
    config = undefined,
    tag = 'div',
  } = defineProps<{
    preset?: string
    config?: GradientConfig
    tag?: string
  }>()

  const { style } = useGradient(computed(() => preset ?? config ?? 'brand'))
</script>

<template>
  <component :is="tag" :style>
    <slot />
  </component>
</template>
