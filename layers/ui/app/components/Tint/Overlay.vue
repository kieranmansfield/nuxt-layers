<script setup lang="ts">
import type { ColorShade, TintColorSlot, TintLevel } from '../../types/tint'

const props = withDefaults(
  defineProps<{
    color: TintColorSlot
    level: TintLevel
    shade?: ColorShade
    tag?: string
  }>(),
  {
    shade: 500,
    tag: 'div',
  }
)

const { style } = useTint(props)
</script>

<template>
  <component :is="tag" class="relative">
    <slot />
    <span class="absolute inset-0 pointer-events-none" :style="style" aria-hidden="true" />
  </component>
</template>
