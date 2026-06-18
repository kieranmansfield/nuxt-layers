<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  import {
    ACESFilmicToneMapping,
    CineonToneMapping,
    Color,
    LinearToneMapping,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    ReinhardToneMapping,
    Scene,
    SRGBColorSpace,
    type ToneMapping,
  } from 'three'
  import * as ThreeWebGPU from 'three/webgpu'

  const {
    material = null,
    clearColor = '#000000',
    toneMapping = 'aces',
    antialias = true,
    fixed = true,
    zIndex = -1,
    pointerEvents = 'none',
  } = defineProps<{
    /** The TSL node material to render */
    material?: MeshBasicNodeMaterial | null
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
  }>()

  const emit = defineEmits<{
    ready: [renderer: ThreeWebGPU.WebGPURenderer]
  }>()

  const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
  const { width, height } = useWindowSize()

  let renderer: ThreeWebGPU.WebGPURenderer | undefined
  let scene: Scene
  let camera: PerspectiveCamera
  let planeMesh: Mesh
  let animationId: number
  let initialized = false
  let initStarted = false
  let disposed = false

  const toneMappingMap: Record<'aces' | 'reinhard' | 'cineon' | 'linear', ToneMapping> = {
    aces: ACESFilmicToneMapping,
    reinhard: ReinhardToneMapping,
    cineon: CineonToneMapping,
    linear: LinearToneMapping,
  }

  const containerStyle = computed<Record<string, string | number>>(() => ({
    position: fixed ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    width: fixed ? '100vw' : '100%',
    height: fixed ? '100vh' : '100%',
    zIndex: zIndex,
    pointerEvents: pointerEvents,
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
    // Bail if the component unmounted — guards against a frame scheduled just
    // before teardown rendering on a disposed renderer.
    if (disposed) return
    animationId = requestAnimationFrame(animate)
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  async function init() {
    const canvas = canvasRef.value
    if (!canvas || disposed) return

    try {
      // WebGPURenderer falls back to WebGL2 if WebGPU is unavailable
      renderer = new ThreeWebGPU.WebGPURenderer({ canvas, antialias: antialias })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width.value, height.value)
      renderer.setClearColor(new Color(clearColor))
      renderer.toneMapping = toneMappingMap[toneMapping] ?? ACESFilmicToneMapping
      renderer.outputColorSpace = SRGBColorSpace

      // Required async init for WebGPU context setup
      await renderer.init()

      // The component can unmount while the await above is pending (navigating
      // away before WebGPU finishes initializing). onUnmounted already ran and
      // disposed the renderer, so abort before starting the animation loop —
      // otherwise we leak a throwing rAF loop rendering on a disposed renderer.
      if (disposed) {
        renderer.dispose()
        return
      }

      scene = new Scene()
      camera = new PerspectiveCamera(75, width.value / (height.value || 1), 0.1, 100)
      camera.position.set(0, 0, 1)

      const { width: pw, height: ph } = getPlaneSize(width.value, height.value)
      const geometry = new PlaneGeometry(pw, ph)
      planeMesh = new Mesh(geometry, material ?? new MeshBasicMaterial({ color: 0x000000 }))
      scene.add(planeMesh)

      // Pre-compile the shader pipeline only when the material's colorNode is already
      // set (i.e. the preset component mounted and emitted @node before us). Without
      // a colorNode the compilation produces a black fallback and a later needsUpdate
      // won't reliably trigger a GPU pipeline rebuild in all drivers.
      // When colorNode is absent we skip pre-compilation and let the first render()
      // call compile lazily — the browser may stutter once, but the output is correct.
      if (material?.colorNode) {
        await renderer.compileAsync(scene, camera)
        if (disposed) {
          renderer.dispose()
          return
        }
      }

      initialized = true
      emit('ready', renderer)
    } catch (e) {
      void e
    }

    // Always start the animation loop even if pre-compilation failed — Three.js
    // will compile lazily on the first render() call.
    if (scene && camera) {
      animate()
    }
  }

  watch(
    () => material,
    (mat) => {
      if (planeMesh && mat) {
        planeMesh.material = mat
      }
    }
  )

  watch(
    () => clearColor,
    (color) => {
      if (renderer && initialized) {
        renderer.setClearColor(new Color(color))
      }
    }
  )

  watch([width, height], ([w, h]) => {
    if (!initialized || !renderer) return
    camera.aspect = w / (h || 1)
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    if (planeMesh) {
      planeMesh.geometry.dispose()
      const { width: pw, height: ph } = getPlaneSize(w, h)
      planeMesh.geometry = new PlaneGeometry(pw, ph)
    }
  })

  // As a `.client.vue` component, the real <canvas> can attach a tick after this
  // component's onMounted fires, leaving canvasRef.value null. Drive init() off the
  // template ref so it runs the moment the canvas element actually binds.
  watch(
    canvasRef,
    (canvas) => {
      if (canvas && !initStarted) {
        initStarted = true
        init()
      }
    },
    { immediate: true, flush: 'post' }
  )

  onUnmounted(() => {
    // Mark disposed first so an in-flight async init() aborts instead of
    // starting the animation loop after teardown.
    disposed = true
    cancelAnimationFrame(animationId)
    planeMesh?.geometry.dispose()
    renderer?.dispose()
  })
</script>

<template>
  <div class="shader-background" :style="containerStyle">
    <canvas ref="canvasRef" style="display: block; width: 100%; height: 100%" />
  </div>
</template>

<style scoped>
  .shader-background {
    contain: strict;
  }
</style>
