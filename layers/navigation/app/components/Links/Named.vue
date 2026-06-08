<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import type { UiColors } from '#layers/typography/types/colors'

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
  <!-- eslint-disable-next-line vue/no-duplicate-attr-inheritance -->
  <!-- eslint-disable vue/no-duplicate-attr-inheritance -->
  <ULink
    :to="{ name: name, params: params, query: query }"
    :variant
    :class="colorClass"
    v-bind="$attrs"
  >
    <slot />
  </ULink>
</template>
