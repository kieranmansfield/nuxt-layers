<script setup lang="ts">
  import type { GradientConfig } from '../../types/gradient'

  const {
    preset = undefined,
    config = undefined,
    tag = 'span',
  } = defineProps<{
    preset?: string
    config?: GradientConfig
    tag?: string
  }>()

  const { style } = useGradient(computed(() => preset ?? config ?? 'brand'))
</script>

<template>
  <component :is="tag" :style class="gradient-text inline-block">
    <slot />
  </component>
</template>
