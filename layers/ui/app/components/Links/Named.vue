<script setup lang="ts">
import { useColor } from '#layers/ui/app/composables/color'
import type { UiColors } from '#layers/ui/app/types/colors'

const props = withDefaults(
  defineProps<{
    name: string
    params?: Record<string, string>
    query?: Record<string, string>
    variant?: string
    color?: UiColors
  }>(),
  {
    params: undefined,
    query: undefined,
    variant: undefined,
    color: undefined,
  }
)
const colorClass = useColor(props.color, 'text')
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
