<script setup lang="ts">
import type { GradientConfig } from '../../types/gradient'

const props = withDefaults(defineProps<{
  preset?: string
  config?: GradientConfig
  tag?: string
}>(), {
  tag: 'div',
})

const { style } = useGradient(
  computed(() => props.preset ?? props.config ?? 'brand'),
)
</script>

<template>
  <component :is="tag" :style="style">
    <slot />
  </component>
</template>
