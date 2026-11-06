<script setup lang="ts">
  import { useScrollScene } from '../../composables/useScrollSteps'

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

  const scene = useScrollScene('MotionScrollStep')

  onMounted(() => scene?.registerStep(index))
  onUnmounted(() => scene?.unregisterStep(index))

  const isActive = computed(() =>
    scene ? isStepActive(scene.progress.value, index, scene.stepCount.value) : index === 0
  )

  const wasActive = ref(false)
  watch(isActive, (active) => {
    if (active === wasActive.value) return
    wasActive.value = active
    if (active) emit('enter')
    else emit('leave')
  })
</script>

<template>
  <div class="motion-scroll-step" :class="{ 'is-active': isActive }" :data-step="index">
    <slot :is-active />
  </div>
</template>
