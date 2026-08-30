<script setup lang="ts">
  /**
   * VStack — vertical, one-dimensional layout (Flexbox column).
   * See nuxt-declarative-layout-system-spec.md §7.
   */

  import type { Justify } from '#layers/core/app/composables/useLayoutAttrs'
  import type { ResponsiveValue } from '#layers/core/types/responsive'
  import type { Spacing } from '#layers/core/types/tokens'

  type VStackAlign = 'start' | 'center' | 'end' | 'stretch'

  const {
    gap = undefined,
    align = undefined,
    justify = undefined,
  } = defineProps<{
    gap?: ResponsiveValue<Spacing> | Spacing
    align?: ResponsiveValue<VStackAlign> | VStackAlign
    justify?: ResponsiveValue<Justify> | Justify
  }>()

  const { style } = useLayoutAttrs(() => ({ gap, align, justify }))
</script>

<template>
  <div class="v-stack" :style>
    <slot />
  </div>
</template>

<style scoped>
  .v-stack {
    display: flex;
    flex-direction: column;
  }
</style>
