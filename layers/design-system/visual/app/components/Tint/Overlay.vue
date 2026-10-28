<script setup lang="ts">
  import type { ColorShade } from '../../types/gradient'
  import type { TintColorSlot, TintLevel } from '../../types/tint'

  const {
    color,
    level,
    shade = 500,
    as = 'div',
  } = defineProps<{
    color: TintColorSlot
    level: TintLevel
    shade?: ColorShade
    as?: string
  }>()

  const { style } = useTint(() => ({ color, level, shade }))
</script>

<template>
  <component :is="as" class="relative">
    <slot />
    <span class="pointer-events-none absolute inset-0" :style aria-hidden="true" />
  </component>
</template>
