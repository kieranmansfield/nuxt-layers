<script setup lang="ts">
  import { useElementStyle } from '../composables/useElementStyle'
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

  const style = useElementStyle(() => ({
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
  }))
</script>

<template>
  <component :is="as" v-bind="componentProps" :style>
    <slot />
  </component>
</template>
