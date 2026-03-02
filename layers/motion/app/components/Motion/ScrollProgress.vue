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
  <ProgressCircular
    v-else
    :progress="progress"
    :size
    :stroke-width="strokeWidth"
    :show-percentage="showPercentage"
    :colors
    :bg-color="bgColor"
  />
</template>
