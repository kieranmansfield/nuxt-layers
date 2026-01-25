<script setup lang="ts">
import type { UiColors } from '#layers/ui/app/types/colors'
import { useColor } from '#layers/ui/app/composables/color'

// eslint-disable-next-line no-restricted-syntax
const props = defineProps<{ color?: UiColors }>()
const colorClass = useColor(props.color, 'text')
</script>

<template>
  <Typography tag="blockquote" :class="colorClass" v-bind="$attrs">
    <slot />
  </Typography>
</template>
