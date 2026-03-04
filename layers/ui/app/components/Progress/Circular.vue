<script setup lang="ts">
const {
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  colors = ['var(--color-primary-500)', 'rgb(168, 85, 247)', 'rgb(236, 72, 153)'],
  bgColor = 'rgb(31, 41, 55)',
} = defineProps<{
  progress: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  colors?: [string, string, string]
  bgColor?: string
}>()

const percentage = computed(() => Math.round(progress * 100))
const radius = computed(() => (size - strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDasharray = computed(() => `${progress * circumference.value} ${circumference.value}`)

const gradientId = `progress-circular-gradient-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="progress-circular relative inline-flex items-center justify-center">
    <svg :width="size" :height="size" class="-rotate-90" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray
        class="transition-[stroke-dasharray] duration-100"
      />
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :style="`stop-color: ${colors[0]}`" />
          <stop offset="50%" :style="`stop-color: ${colors[1]}`" />
          <stop offset="100%" :style="`stop-color: ${colors[2]}`" />
        </linearGradient>
      </defs>
    </svg>
    <span
      v-if="showPercentage"
      class="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums"
    >
      {{ percentage }}%
    </span>
  </div>
</template>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
