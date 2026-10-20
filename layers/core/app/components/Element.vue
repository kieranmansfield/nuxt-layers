<script setup lang="ts">
  import { useElementStyle } from '../composables/useElementStyle'
  import type { ElementProps } from '../types/element'

  const props = withDefaults(defineProps<ElementProps>(), { as: 'div' })

  const style = useElementStyle(() => props)
</script>

<template>
  <component :is="as" v-bind="componentProps" :style>
    <slot />
  </component>
</template>
