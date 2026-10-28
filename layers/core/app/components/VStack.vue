<script setup lang="ts">
  /**
   * VStack — vertical, one-dimensional layout (Flexbox column), sized by its content.
   * See nuxt-declarative-layout-system-spec.md §7.
   */
  import { useLayoutAttrs, type Justify } from '../composables/useLayoutAttrs'
  import type { AsProps, SpacingProps } from '../types/element'
  import type { Spacing } from '../types/tokens'

  // No 'baseline': it only means something across a row
  type VStackAlign = 'start' | 'center' | 'end' | 'stretch'

  const {
    as = 'div',
    gap = undefined,
    align = undefined,
    justify = undefined,
    wrap = false,
    ...spacing
  } = defineProps<
    AsProps &
      SpacingProps & {
        gap?: Spacing
        align?: VStackAlign
        justify?: Justify
        wrap?: boolean
      }
  >()

  const { style } = useLayoutAttrs(() => ({ gap, align, justify, ...spacing }))
</script>

<template>
  <component :is="as" class="v-stack" :data-wrap="wrap || undefined" :style>
    <slot />
  </component>
</template>
