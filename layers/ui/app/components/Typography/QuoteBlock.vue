<script setup lang="ts">
import { useColor } from '../../composables/color'
import type { UiColors } from '../../types/colors'
import type { FontSize } from '../../types/typography'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ color?: UiColors; size?: FontSize }>()
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography tag="blockquote" :size="props.size" :class="colorClass" v-bind="$attrs">
    <slot />
  </Typography>
</template>
