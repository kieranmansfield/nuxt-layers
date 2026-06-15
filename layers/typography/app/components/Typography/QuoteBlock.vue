<script setup lang="ts">
  import { useColor } from '../../composables/color'
  import type { UiColors } from '../../types/colors'
  import type { FontSize } from '../../types/typography'

  defineOptions({ inheritAttrs: false })

  const { color = undefined, size = undefined } = defineProps<{ color?: UiColors; size?: FontSize }>()
  const colorClass = useColor(color, 'text')
</script>

<template>
  <Typography
    tag="blockquote"
    :class="colorClass"
    v-bind="{ ...(size !== undefined && { size: size }), ...$attrs }"
  >
    <slot />
  </Typography>
</template>
