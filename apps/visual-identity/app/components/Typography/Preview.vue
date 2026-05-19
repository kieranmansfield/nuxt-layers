<script setup lang="ts">
import type { FontAxes } from '~/composables/useBrandState'

const props = defineProps<{
  axes: FontAxes
  family?: string
  previewText?: string
}>()

const variationSettings = computed(() => {
  return Object.entries(props.axes)
    .map(([k, v]) => `'${k}' ${v}`)
    .join(', ')
})

const family = computed(() => props.family ?? 'Roboto Flex')
</script>

<template>
  <div
    class="font-preview select-none transition-all duration-100 text-(--ui-text)"
    :style="{
      fontFamily: `'${family}', sans-serif`,
      fontVariationSettings: variationSettings,
    }"
  >
    {{ previewText ?? 'Aa' }}
  </div>
</template>
