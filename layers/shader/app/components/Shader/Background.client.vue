<script setup lang="ts">
// @ts-nocheck - Three.js WebGPU types
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  Color,
  LinearToneMapping,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  ReinhardToneMapping,
  Scene,
  SRGBColorSpace,
} from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { useWindowSize } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    /** The TSL node material to render */
    material?: any
    /** Background clear color */
    clearColor?: string
    /** Tone mapping algorithm */
    toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    /** Enable antialiasing */
    antialias?: boolean
    /** Fixed position (covers viewport) */
    fixed?: boolean
    /** Z-index for the background */
    zIndex?: number
    /** Pointer events on the canvas */
    pointerEvents?: 'none' | 'auto'
  }>(),
  {
    material: null,
    clearColor: '#000000',
    toneMapping: 'aces',
    antialias: true,
    fixed: true,
    zIndex: -1,
    pointerEvents: 'none',
  }
)

const emit = defineEmits<{
  ready: [renderer: any]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const { width, height } = useWindowSize()

let renderer: any
let scene: Scene
let camera: PerspectiveCamera
let planeMesh: Mesh
let animationId: number
let initialized = false

const toneMappingMap: Record<string, number> = {
  aces: ACESFilmicToneMapping,
  reinhard: ReinhardToneMapping,
  cineon: CineonToneMapping,
  linear: LinearToneMapping,
}

const containerStyle = computed<Record<string, string | number>>(() => ({
  position: props.fixed ? 'fixed' : 'absolute',
  top: 0,
  left: 0,
  width: props.fixed ? '100vw' : '100%',
  height: props.fixed ? '100vh' : '100%',
  zIndex: props.zIndex,
  pointerEvents: props.pointerEvents,
  overflow: 'hidden',
}))

function getPlaneSize(w: number, h: number) {
  const fov = 75 * (Math.PI / 180)
  const cameraZ = 1
  const planeHeight = 2 * Math.tan(fov / 2) * cameraZ
  const aspect = w / (h || 1)
  return {
    width: planeHeight * aspect * 1.1,
    height: planeHeight * 1.1,
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

async function init() {
  const canvas = canvasRef.value
  if (!canvas) return

  // WebGPURenderer falls back to WebGL2 if WebGPU is unavailable
  renderer = new WebGPURenderer({ canvas, antialias: props.antialias })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width.value, height.value)
  renderer.setClearColor(new Color(props.clearColor))
  renderer.toneMapping = toneMappingMap[props.toneMapping] ?? ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace

  // Required async init for WebGPU context setup
  await renderer.init()

  scene = new Scene()
  camera = new PerspectiveCamera(75, width.value / (height.value || 1), 0.1, 100)
  camera.position.set(0, 0, 1)

  const { width: pw, height: ph } = getPlaneSize(width.value, height.value)
  const geometry = new PlaneGeometry(pw, ph)
  planeMesh = new Mesh(geometry, props.material ?? new MeshBasicMaterial({ color: 0x000000 }))
  scene.add(planeMesh)

  initialized = true
  emit('ready', renderer)
  animate()
}

watch(
  () => props.material,
  (mat) => {
    if (planeMesh && mat) {
      planeMesh.material = mat
    }
  }
)

watch([width, height], ([w, h]) => {
  if (!initialized) return
  camera.aspect = w / (h || 1)
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  if (planeMesh) {
    planeMesh.geometry.dispose()
    const { width: pw, height: ph } = getPlaneSize(w, h)
    planeMesh.geometry = new PlaneGeometry(pw, ph)
  }
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  planeMesh?.geometry.dispose()
  renderer?.dispose()
})
</script>

<template>
  <div class="shader-background" :style="containerStyle">
    <canvas ref="canvasRef" style="display: block; width: 100%; height: 100%;" />
  </div>
</template>

<style scoped>
.shader-background {
  contain: strict;
}
</style>
