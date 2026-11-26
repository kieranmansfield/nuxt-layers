<script setup lang="ts">
  import {
    useDevicePixelRatio,
    useElementSize,
    useElementVisibility,
    useWindowSize,
  } from '@vueuse/core'
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
  import { MeshBasicNodeMaterial } from 'three/webgpu'

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
    /** Renderer init or shader pre-compilation threw. */
    error: [error: unknown]
  }>()

  defineSlots<{
    /** Shown instead of the canvas when no renderer could start (blocklisted GPU, lost context). */
    fallback?: () => unknown
  }>()

  /** Schedule one frame; use after changing the material graph while the loop is parked. */
  defineExpose({ kick })

  const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
  const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
  // Fixed covers the viewport; otherwise the drawing buffer follows the container, not the window.
  const windowSize = useWindowSize()
  const elementSize = useElementSize(containerRef)
  const width = computed(() => (fixed ? windowSize.width.value : elementSize.width.value))
  const height = computed(() => (fixed ? windowSize.height.value : elementSize.height.value))
  // Browser zoom changes devicePixelRatio; reading it once at init left zoomed-out pages
  // rendering at the old ratio, past WebGPU's 8192px texture limit.
  const { pixelRatio } = useDevicePixelRatio()
  const maxPixelRatio = (useAppConfig().shader as { maxPixelRatio?: number } | undefined)
    ?.maxPixelRatio
  const cappedPixelRatio = () => Math.min(pixelRatio.value, maxPixelRatio ?? 2)

  // Loop only while on screen and motion is allowed. Parked, it still draws single frames
  // on kick(): material changes, resizes and theme switches (CSS-variable uniforms).
  const { effectiveReducedMotion } = useThemeMotion()
  const visible = useElementVisibility(containerRef)
  const live = computed(() => visible.value && !effectiveReducedMotion.value)
  const failed = ref(false)

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

  function createRenderer(canvas: HTMLCanvasElement) {
    const nextRenderer = new ThreeWebGPU.WebGPURenderer({ canvas, antialias: antialias })
    nextRenderer.setPixelRatio(cappedPixelRatio())
    nextRenderer.setSize(width.value, height.value)
    nextRenderer.setClearColor(new Color(clearColor))
    nextRenderer.toneMapping = toneMappingMap[toneMapping] ?? ACESFilmicToneMapping
    nextRenderer.outputColorSpace = SRGBColorSpace
    return nextRenderer
  }

  function createSceneAndCamera() {
    const nextScene = new Scene()
    const nextCamera = new PerspectiveCamera(75, width.value / (height.value || 1), 0.1, 100)
    nextCamera.position.set(0, 0, 1)
    return { nextScene, nextCamera }
  }

  function createPlaneMesh() {
    const { width: pw, height: ph } = getPlaneSize(width.value, height.value)
    const geometry = new PlaneGeometry(pw, ph)
    return new Mesh(geometry, material ?? new MeshBasicMaterial({ color: 0x000000 }))
  }

  // fallow-ignore-next-line complexity
  async function compileMaterialIfReady() {
    if (!renderer || !scene || !camera || !material?.colorNode) return
    await renderer.compileAsync(scene, camera)
    if (disposed && renderer) {
      renderer.dispose()
    }
  }

  function animate() {
    // Bail if the component unmounted — guards against a frame scheduled just
    // before teardown rendering on a disposed renderer.
    if (disposed) return
    // Schedule before rendering so one throwing frame doesn't end a live loop.
    if (live.value) schedule()
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  // Every frame goes through here, and a new one replaces any pending one: one chain, never two.
  function schedule() {
    cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(animate)
  }

  // A frame, not a direct render: uniform observers sync before it runs.
  function kick() {
    if (disposed || !scene || !camera) return
    schedule()
  }

  async function init() {
    const canvas = canvasRef.value
    if (!canvas || disposed) return

    try {
      // WebGPURenderer falls back to WebGL2 if WebGPU is unavailable
      renderer = createRenderer(canvas)

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

      const { nextScene, nextCamera } = createSceneAndCamera()
      scene = nextScene
      camera = nextCamera
      planeMesh = createPlaneMesh()
      scene.add(planeMesh)

      // Pre-compile the shader pipeline only when the material's colorNode is already
      // set (i.e. the preset component mounted and emitted @node before us). Without
      // a colorNode the compilation produces a black fallback and a later needsUpdate
      // won't reliably trigger a GPU pipeline rebuild in all drivers.
      // When colorNode is absent we skip pre-compilation and let the first render()
      // call compile lazily — the browser may stutter once, but the output is correct.
      await compileMaterialIfReady()
      if (disposed) return

      initialized = true
      applySize()
      emit('ready', renderer)
    } catch (e) {
      emit('error', e)
      // No scene means the renderer never started: show the fallback slot instead.
      if (!scene) {
        failed.value = true
        renderer?.dispose()
        renderer = undefined
      }
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
        kick()
      }
    }
  )

  watch(
    () => clearColor,
    (color) => {
      if (renderer && initialized) {
        renderer.setClearColor(new Color(color))
        kick()
      }
    }
  )

  // Also called once after init, so a size that changed during the async init isn't lost.
  function applySize() {
    const w = width.value
    const h = height.value
    if (!initialized || !renderer || !w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(cappedPixelRatio())
    renderer.setSize(w, h)
    if (planeMesh) {
      planeMesh.geometry.dispose()
      const { width: pw, height: ph } = getPlaneSize(w, h)
      planeMesh.geometry = new PlaneGeometry(pw, ph)
    }
    kick()
  }

  watch([width, height, pixelRatio], applySize)
  watch(live, kick)
  useRootStyleObserver(kick)

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
  <div ref="containerRef" class="shader-background" :style="containerStyle">
    <canvas
      v-show="!failed"
      ref="canvasRef"
      aria-hidden="true"
      style="display: block; width: 100%; height: 100%"
    />
    <slot v-if="failed" name="fallback" />
  </div>
</template>

<style scoped>
  .shader-background {
    contain: strict;
  }
</style>
