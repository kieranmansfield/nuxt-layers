<script setup lang="ts">
import { useColor } from '../../composables/color'
import type { UiColors } from '../../types/colors'

const {
  name,
  params = undefined,
  query = undefined,
  variant = undefined,
  color = undefined,
} = defineProps<{
  name: string
  params?: Record<string, string>
  query?: Record<string, string>
  variant?: string
  color?: UiColors
}>()
const colorClass = useColor(color, 'text')
</script>

<template>
  <ULink
    :to="{ name: name, params: params, query: query }"
    :variant
    :class="colorClass"
    v-bind="$attrs"
  >
    <slot />
  </ULink>
</template>
