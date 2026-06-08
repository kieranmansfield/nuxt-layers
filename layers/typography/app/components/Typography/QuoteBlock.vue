<!-- eslint-disable vue/define-props-destructuring -->
<script setup lang="ts">
  import { useColor } from '../../composables/color'
  import type { UiColors } from '../../types/colors'
  import type { FontSize } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

  const props = defineProps<{ color?: UiColors; size?: FontSize }>()
  const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography
    tag="blockquote"
    :class="colorClass"
    v-bind="{ ...(props.size !== undefined && { size: props.size }), ...$attrs }"
  >
    <slot />
  </Typography>
</template>
