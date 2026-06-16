<script setup lang="ts">
  import type { FontAxes } from '~/composables/useBrandState'

  const {
    axes,
    family = 'Roboto Flex',
    previewText = 'Aa',
  } = defineProps<{
    axes: FontAxes
    family?: string
    previewText?: string
  }>()

  const variationSettings = computed(() => {
    return Object.entries(axes)
      .map(([k, v]) => `'${k}' ${v}`)
      .join(', ')
  })
</script>

<template>
  <div
    class="font-preview select-none transition-all duration-100 text-default"
    :style="{
      fontFamily: `'${family}', sans-serif`,
      fontVariationSettings: variationSettings,
    }"
  >
    {{ previewText }}
  </div>
</template>
