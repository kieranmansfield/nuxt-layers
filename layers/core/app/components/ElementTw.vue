<script setup lang="ts">
  // computed() needs an explicit import here (rather than Nuxt's auto-import) so this
  // component still mounts under vitest's 'vue' project, which has no Nuxt auto-import
  // context — same tension as Element.vue/Group.vue/BaselineStatus.vue, exempted below.
  import { computed } from 'vue'

  import { useElementStyle } from '../composables/useElementStyle'
  import type { ElementProps } from '../types/element'
  import { styleToTailwindClasses } from '../utils/styleToTailwindClasses'

  const props = defineProps<ElementProps>()

  const style = useElementStyle(props)
  const twClasses = computed(() => styleToTailwindClasses(style.value))
</script>

<template>
  <component :is="props.as ?? 'div'" v-bind="props.componentProps" :class="twClasses">
    <slot />
  </component>
</template>
