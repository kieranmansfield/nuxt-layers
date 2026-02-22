<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { useColor } from '#layers/ui/app/composables/color'
import type { UiColors } from '#layers/ui/app/types/colors'
import type { FontSize } from '#layers/ui/app/types/typography'

const props = defineProps<{ color?: UiColors; size?: FontSize }>()
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography tag="blockquote" :size="props.size" :class="colorClass" v-bind="$attrs">
    <slot />
  </Typography>
</template>
