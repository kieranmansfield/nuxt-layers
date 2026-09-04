<script setup lang="ts">
  // computed() needs an explicit import here (rather than Nuxt's auto-import) so this
  // component still mounts under vitest's 'vue' project, which has no Nuxt auto-import
  // context — same tension as Element.vue's history/Group.vue/BaselineStatus.vue, exempted below.
  import { computed } from 'vue'

  import { useElementStyle } from '../composables/useElementStyle'
  import type { ElementProps } from '../types/element'
  import { styleToTailwindClasses } from '../utils/styleToTailwindClasses'

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

  const twClasses = computed(() => styleToTailwindClasses(style.value))
</script>

<template>
  <component :is="as" v-bind="componentProps" :class="twClasses">
    <slot />
  </component>
</template>
