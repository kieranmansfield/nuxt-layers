<script setup lang="ts">
import type { ScrollSceneContext } from '../../composables/useScrollSteps'
import { SCROLL_SCENE_KEY } from '../../composables/useScrollSteps'

const { index } = defineProps<{
  /**
   * Zero-based step index within the parent MotionScrollScene
   */
  index: number
}>()

const emit = defineEmits<{
  enter: []
  leave: []
}>()

const scene = inject<ScrollSceneContext>(SCROLL_SCENE_KEY)

onMounted(() => scene?.registerStep(index))
onUnmounted(() => scene?.unregisterStep(index))

const isActive = computed(() => {
  if (!scene) return index === 0
  const total = scene.stepCount.value
  if (total === 0) return false
  const stepSize = 1 / total
  const start = index * stepSize
  const end = (index + 1) * stepSize
  // Last step stays active at progress === 1
  return scene.progress.value >= start && (index === total - 1 || scene.progress.value < end)
})

const wasActive = ref(false)
watch(isActive, (active) => {
  if (active && !wasActive.value) emit('enter')
  else if (!active && wasActive.value) emit('leave')
  wasActive.value = active
})
</script>

<template>
  <div class="motion-scroll-step" :class="{ 'is-active': isActive }" :data-step="index">
    <slot :is-active="isActive" />
  </div>
</template>
