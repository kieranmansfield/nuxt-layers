<!-- eslint-disable no-console -->
<script setup lang="ts">
// @ts-nocheck - WebGPU types
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

const props = withDefaults(
  defineProps<{
    clearColor?: string
    width?: number
    height?: number
  }>(),
  {
    clearColor: '#000000',
    width: 0,
    height: 0,
  }
)

const emit = defineEmits<{
  ready: [{ scene: THREE.Scene; camera: THREE.Camera; renderer: any }]
  resize: [{ width: number; height: number }]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isWebGPUSupported = ref(false)
const isReady = ref(false)
const error = ref<string | null>(null)

let renderer: any = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let animationId: number | null = null

async function init() {
  if (!canvasRef.value || !containerRef.value) return

  // Check WebGPU support
  if (!('gpu' in navigator)) {
    error.value = 'WebGPU is not supported in this browser'
    isWebGPUSupported.value = false
    return
  }

  try {
    const adapter = await (navigator as any).gpu.requestAdapter()
    if (!adapter) {
      error.value = 'Failed to get WebGPU adapter'
      isWebGPUSupported.value = false
      return
    }

    isWebGPUSupported.value = true

    // Get container dimensions
    const rect = containerRef.value.getBoundingClientRect()
    const width = props.width || rect.width
    const height = props.height || rect.height

    // Create scene
    scene = new THREE.Scene()

    // Create camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 1

    // Create WebGPU renderer
    renderer = new WebGPURenderer({
      canvas: canvasRef.value,
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(new THREE.Color(props.clearColor))

    // Wait for renderer to initialize
    await renderer.init()

    isReady.value = true

    emit('ready', { scene, camera, renderer })

    // Start render loop
    animate()
  } catch (e: any) {
    error.value = e.message || 'Failed to initialize WebGPU'
    console.error('WebGPU init error:', e)
  }
}

function animate() {
  if (!renderer || !scene || !camera) return

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  if (!containerRef.value || !renderer || !camera) return

  const rect = containerRef.value.getBoundingClientRect()
  const width = props.width || rect.width
  const height = props.height || rect.height

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)

  emit('resize', { width, height })
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  if (renderer) renderer.dispose()
})

watch(
  () => props.clearColor,
  (color) => {
    if (renderer) renderer.setClearColor(new THREE.Color(color))
  }
)

// Expose for parent components
defineExpose({
  scene: () => scene,
  camera: () => camera,
  renderer: () => renderer,
  isReady,
  isWebGPUSupported,
})
</script>

<template>
  <div ref="containerRef" class="webgpu-canvas-container">
    <canvas ref="canvasRef" class="webgpu-canvas" />

    <!-- WebGPU not supported fallback -->
    <div v-if="!isWebGPUSupported && error" class="webgpu-fallback">
      <div class="fallback-content">
        <svg class="fallback-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="fallback-title">WebGPU Not Supported</p>
        <p class="fallback-message">{{ error }}</p>
        <p class="fallback-hint">Try using Chrome 113+ or Edge 113+</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="!isReady" class="webgpu-loading">
      <div class="loading-spinner" />
      <p>Initializing WebGPU...</p>
    </div>

    <slot v-if="isReady" :scene :camera :renderer />
  </div>
</template>

<style scoped>
/* stylelint-disable color-no-hex */
/* stylelint-disable function-disallowed-list */
.webgpu-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.webgpu-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.webgpu-fallback,
.webgpu-loading {
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
  color: white;
  text-align: center;
}

.fallback-content {
  max-width: 300px;
}

.fallback-icon {
  margin-bottom: 1rem;
  width: 48px;
  height: 48px;
  color: #f59e0b;
}

.fallback-title {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.25rem;
}

.fallback-message {
  margin-bottom: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.fallback-hint {
  color: #64748b;
  font-size: 0.75rem;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  border: 3px solid rgb(255 255 255 / 0.1);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
