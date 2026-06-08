<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/define-props-destructuring -->
<script setup lang="ts">
  import type { GradientConfig } from '../../types/gradient'

  const props = withDefaults(
    defineProps<{
      preset?: string
      config?: GradientConfig
      tag?: string
    }>(),
    {
      tag: 'span',
    }
  )

  const { style } = useGradient(computed(() => props.preset ?? props.config ?? 'brand'))
</script>

<template>
  <component :is="tag" :style class="gradient-text inline-block">
    <slot />
  </component>
</template>
