<script setup lang="ts">
  // computed() needs an explicit import here (rather than Nuxt's auto-import) so this
  // component still mounts under vitest's 'vue' project, which has no Nuxt auto-import
  // context — same tension as Group.vue/BaselineStatus.vue, exempted below.
  import { computed, type CSSProperties } from 'vue'
  import { useLayoutAttrs } from '#layers/core/app/composables/useLayoutAttrs'

  import { useElementGrid } from '../composables/useElementGrid'
  import { useElementInteraction } from '../composables/useElementInteraction'
  import { useElementLayout } from '../composables/useElementLayout'
  import { useElementSizing } from '../composables/useElementSizing'
  import { useElementSurface } from '../composables/useElementSurface'
  import type { ElementProps } from '../types/element'

  const {
    as = 'div',
    componentProps,
    block,
    flex,
    grid: gridMode,
    hidden,
    cols,
    rows,
    gap,
    align,
    justify,
    p,
    px,
    py,
    m,
    mx,
    my,
    w,
    h,
    minW,
    maxW,
    minH,
    maxH,
    aspect,
    bg,
    color,
    border,
    radius,
    shadow,
    cursor,
    select,
    pointer,
  } = defineProps<ElementProps>()

  const style = computed<CSSProperties>(() => ({
    ...useElementLayout({ block, flex, grid: gridMode, hidden }),
    ...useLayoutAttrs(() => ({ gap, align, justify, p, px, py, m, mx, my })).style.value,
    ...useElementGrid({ grid: gridMode, cols, rows }),
    ...useElementSizing({ w, h, minW, maxW, minH, maxH, aspect }),
    ...useElementSurface({ bg, color, border, radius, shadow }),
    ...useElementInteraction({ cursor, select, pointer }),
  }))
</script>

<template>
  <component :is="as" v-bind="componentProps" :style>
    <slot />
  </component>
</template>
