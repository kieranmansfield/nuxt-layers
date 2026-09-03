<script setup lang="ts">
  import { computed, type CSSProperties } from 'vue'
  import { useLayoutAttrs } from '#layers/core/app/composables/useLayoutAttrs'

  import { useElementGrid } from '../composables/useElementGrid'
  import { useElementInteraction } from '../composables/useElementInteraction'
  import { useElementLayout } from '../composables/useElementLayout'
  import { useElementSizing } from '../composables/useElementSizing'
  import { useElementSurface } from '../composables/useElementSurface'
  import type { ElementProps } from '../types/element'

  const props = withDefaults(defineProps<ElementProps>(), {
    as: 'div',
  })

  const style = computed<CSSProperties>(() => ({
    ...useElementLayout(props),
    ...useLayoutAttrs(() => props).style.value,
    ...useElementGrid(props),
    ...useElementSizing(props),
    ...useElementSurface(props),
    ...useElementInteraction(props),
  }))
</script>

<template>
  <component :is="as" :style>
    <slot />
  </component>
</template>
