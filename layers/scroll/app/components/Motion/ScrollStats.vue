<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * Which stats to show
     */
    show?: ('velocity' | 'progress' | 'direction' | 'scrollY')[]
    /**
     * Position on screen
     */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    /**
     * Use compact layout
     */
    compact?: boolean
  }>(),
  {
    show: () => ['velocity', 'progress', 'direction'],
    position: 'bottom-right',
    compact: false,
  }
)

const { velocity, progress, direction, scrollY } = useSmoothScroll()

const isScrolling = computed(() => Math.abs(velocity.value) > 0.01)

const positionClasses = computed(() => {
  const classes = ['fixed', 'z-50']
  switch (props.position) {
    case 'top-left':
      classes.push('top-4', 'left-4')
      break
    case 'top-right':
      classes.push('top-4', 'right-4')
      break
    case 'bottom-left':
      classes.push('bottom-4', 'left-4')
      break
    case 'bottom-right':
    default:
      classes.push('bottom-4', 'right-4')
      break
  }
  return classes
})

const directionLabel = computed(() => {
  if (direction.value > 0) return 'DOWN'
  if (direction.value < 0) return 'UP'
  return 'IDLE'
})
</script>

<template>
  <div
    class="bg-black/80 backdrop-blur-sm text-white rounded-xl transition-opacity duration-300"
    :class="[
      ...positionClasses,
      isScrolling ? 'opacity-100' : 'opacity-60',
      compact ? 'px-3 py-2' : 'px-4 py-3',
    ]"
  >
    <div class="flex items-center" :class="[compact ? 'gap-4 text-xs' : 'gap-6 text-sm']">
      <!-- Scrolling indicator -->
      <div
        class="w-2 h-2 rounded-full transition-colors duration-100"
        :class="isScrolling ? 'bg-green-500' : 'bg-gray-600'"
      />

      <!-- Velocity -->
      <div v-if="show.includes('velocity')" class="text-center">
        <div v-if="!compact" class="text-gray-500 text-xs mb-0.5">VEL</div>
        <div class="font-medium tabular-nums">{{ velocity.toFixed(2) }}</div>
      </div>

      <!-- Progress -->
      <div v-if="show.includes('progress')" class="text-center">
        <div v-if="!compact" class="text-gray-500 text-xs mb-0.5">PROG</div>
        <div class="font-medium tabular-nums">{{ (progress * 100).toFixed(0) }}%</div>
      </div>

      <!-- Direction -->
      <div v-if="show.includes('direction')" class="text-center">
        <div v-if="!compact" class="text-gray-500 text-xs mb-0.5">DIR</div>
        <div class="font-medium">{{ directionLabel }}</div>
      </div>

      <!-- Scroll Y -->
      <div v-if="show.includes('scrollY')" class="text-center">
        <div v-if="!compact" class="text-gray-500 text-xs mb-0.5">Y</div>
        <div class="font-medium tabular-nums">{{ Math.round(scrollY) }}px</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
