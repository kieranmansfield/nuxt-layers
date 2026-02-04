<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * Display type: linear bar or circular
     */
    type?: 'linear' | 'circular'
    /**
     * Size for circular progress (px)
     */
    size?: number
    /**
     * Stroke width for circular progress
     */
    strokeWidth?: number
    /**
     * Show percentage text
     */
    showPercentage?: boolean
    /**
     * Gradient colors (start, middle, end)
     */
    colors?: [string, string, string]
    /**
     * Background color
     */
    bgColor?: string
    /**
     * Height for linear progress bar (px)
     */
    height?: number
  }>(),
  {
    type: 'linear',
    size: 120,
    strokeWidth: 8,
    showPercentage: true,
    colors: () => ['var(--color-primary-500)', 'rgb(168, 85, 247)', 'rgb(236, 72, 153)'],
    bgColor: 'rgb(31, 41, 55)',
    height: 4,
  }
)

const { progress } = useSmoothScroll()

const percentage = computed(() => Math.round(progress.value * 100))

// For circular progress
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDasharray = computed(
  () => `${progress.value * circumference.value} ${circumference.value}`
)

// Generate gradient ID
const gradientId = `scroll-progress-gradient-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <!-- Linear Progress -->
  <div v-if="type === 'linear'" class="motion-scroll-progress-linear">
    <div
      class="w-full rounded-full overflow-hidden"
      :style="{ height: `${height}px`, backgroundColor: bgColor }"
    >
      <div
        class="h-full rounded-full transition-[width] duration-100"
        :style="{
          width: `${percentage}%`,
          background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        }"
      />
    </div>
    <span v-if="showPercentage" class="text-sm font-medium tabular-nums mt-2 block text-center">
      {{ percentage }}%
    </span>
  </div>

  <!-- Circular Progress -->
  <div
    v-else
    class="motion-scroll-progress-circular relative inline-flex items-center justify-center"
  >
    <svg :width="size" :height="size" class="-rotate-90" :viewBox="`0 0 ${size} ${size}`">
      <!-- Background circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="bgColor"
        :stroke-width
      />
      <!-- Progress circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width
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
