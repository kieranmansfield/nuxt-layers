<script setup lang="ts">
  /**
   * ZStack — layered content. A single-area CSS grid; direct children all share that one
   * grid area, stacking by source order (later = on top). Unlike `absolute inset-0`
   * overlays, every layer stays in flow, so the stack sizes to its largest child.
   * See nuxt-declarative-layout-system-spec.md §8.
   *
   * `place` aligns every layer within the shared area (`place-items`); a single layer can
   * still override it with its own `place-self`.
   */
  import { useLayoutAttrs } from '../composables/useLayoutAttrs'
  import type { AsProps, SpacingProps } from '../types/element'

  type ZStackPlace = 'start' | 'center' | 'end' | 'stretch'

  const {
    as = 'div',
    place = undefined,
    ...spacing
  } = defineProps<AsProps & SpacingProps & { place?: ZStackPlace }>()

  const { style } = useLayoutAttrs(() => spacing)
</script>

<template>
  <component :is="as" class="z-stack" :data-place="place" :style>
    <slot />
  </component>
</template>
