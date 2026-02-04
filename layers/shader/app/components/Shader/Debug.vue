<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show?: boolean
  }>(),
  {
    show: true,
  }
)

const config = useAppConfig()
const shaderConfig = (config.shader || {}) as {
  debugPanel?: boolean
}

const { $shader } = useNuxtApp() as { $shader?: { useWebGPU: boolean } }

const showDebug = computed(() => {
  if (!props.show) return false
  return import.meta.dev && shaderConfig.debugPanel !== false
})

const fps = ref(0)
const frameCount = ref(0)
let lastTime = performance.now()
let animationFrameId: number | null = null

function updateFps() {
  frameCount.value++
  const now = performance.now()
  if (now - lastTime >= 1000) {
    fps.value = Math.round((frameCount.value * 1000) / (now - lastTime))
    frameCount.value = 0
    lastTime = now
  }
  animationFrameId = requestAnimationFrame(updateFps)
}

onMounted(() => {
  if (showDebug.value) {
    updateFps()
  }
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div v-if="showDebug" class="shader-debug">
    <div class="shader-debug-title">Shader Debug</div>

    <div class="shader-debug-row">
      <span class="shader-debug-label">Renderer</span>
      <span class="shader-debug-value">{{ $shader?.useWebGPU ? 'WebGPU' : 'WebGL' }}</span>
    </div>

    <div class="shader-debug-row">
      <span class="shader-debug-label">FPS</span>
      <span class="shader-debug-value">{{ fps }}</span>
    </div>
  </div>
</template>
