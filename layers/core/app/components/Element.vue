<script setup lang="ts">
  // computed() needs an explicit import here (rather than Nuxt's auto-import) so this
  // component still mounts under vitest's 'vue' project, which has no Nuxt auto-import
  // context — same tension as Group.vue/BaselineStatus.vue, exempted below.
  import { useElementStyle } from '../composables/useElementStyle'
  import type { ElementProps } from '../types/element'

  const props = defineProps<ElementProps>()

  const style = useElementStyle(props)
</script>

<template>
  <component :is="props.as ?? 'div'" v-bind="props.componentProps" :style>
    <slot />
  </component>
</template>
