<script setup lang="ts">
import type { AccentColor } from '#layers/theme/app/types/theme'

const COLORS: Record<AccentColor, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
}

const { color, active = false } = defineProps<{
  color: AccentColor
  active?: boolean
}>()

const emit = defineEmits<{
  select: [color: AccentColor]
}>()

const bgStyle = computed(() => ({
  backgroundColor: COLORS[color],
}))
</script>

<template>
  <button
    class="size-8 rounded-full ring-1 ring-offset-2 transition-shadow duration-200"
    :class="[
      active
        ? 'ring-2 ring-primary ring-offset-[var(--ui-bg)] shadow-lg'
        : 'ring-transparent hover:ring-muted ring-offset-[var(--ui-bg)] hover:shadow-md',
    ]"
    :style="bgStyle"
    :aria-label="`Set accent color to ${color}`"
    :aria-pressed="active"
    @click="emit('select', color)"
  />
</template>
