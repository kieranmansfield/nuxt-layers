<script setup lang="ts">
  import { useElementStyle } from '../composables/useElementStyle'
  import type { ElementProps } from '../types/element'

  const { as = 'div', componentProps, ...styleProps } = defineProps<ElementProps>()

  const style = useElementStyle(() => styleProps)
</script>

<template>
  <component :is="as" v-bind="componentProps" :style>
    <slot />
  </component>
</template>
