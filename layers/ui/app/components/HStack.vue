<script setup lang="ts">
  /**
   * HStack — horizontal, one-dimensional layout (Flexbox row).
   * See nuxt-declarative-layout-system-spec.md §6.
   */

  import type { Align, Justify } from '#layers/core/app/composables/useLayoutAttrs'
  import type { ResponsiveValue } from '#layers/core/types/responsive'
  import type { Spacing } from '#layers/core/types/tokens'

  const {
    gap = undefined,
    align = undefined,
    justify = undefined,
    wrap = false,
  } = defineProps<{
    gap?: ResponsiveValue<Spacing> | Spacing
    align?: ResponsiveValue<Align> | Align
    justify?: ResponsiveValue<Justify> | Justify
    wrap?: boolean
  }>()

  const { style } = useLayoutAttrs(() => ({ gap, align, justify }))
</script>

<template>
  <div class="h-stack" :class="{ 'h-stack-wrap': wrap }" :style>
    <slot />
  </div>
</template>

<style scoped>
  .h-stack {
    display: flex;
    flex-direction: row;
  }

  .h-stack-wrap {
    flex-wrap: wrap;
  }
</style>
