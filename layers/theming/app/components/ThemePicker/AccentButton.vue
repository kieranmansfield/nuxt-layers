<script setup lang="ts">
  import type { AccentColor } from '#layers/theming/app/types/theme'
  import { ACCENT_SWATCH } from '#layers/theming/app/utils/accentPalette'

  const { color, active = false } = defineProps<{
    color: AccentColor
    active?: boolean
  }>()

  const emit = defineEmits<{
    select: [color: AccentColor]
  }>()

  const bgStyle = computed(() => ({
    backgroundColor: ACCENT_SWATCH[color],
  }))
</script>

<template>
  <button
    class="size-8 rounded-full ring-1 ring-offset-2 transition-shadow duration-200"
    :class="[
      active
        ? 'ring-2 ring-primary ring-offset-bg shadow-lg'
        : 'ring-transparent hover:ring-muted ring-offset-bg hover:shadow-md',
    ]"
    :style="bgStyle"
    :aria-label="`Set accent color to ${color}`"
    :aria-pressed="active"
    @click="() => emit('select', color)"
  />
</template>
