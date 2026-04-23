/**
 * useShaderPerf — lightweight performance monitor for shader pipelines.
 *
 * Tracks frame time, frame rate, and stage count for a named pipeline.
 * Designed to be used in development to identify bottlenecks.
 *
 * Usage:
 *   const perf = useShaderPerf('myScene')
 *   // call perf.tick() each frame (e.g. from useRenderLoop or requestAnimationFrame)
 *   // read perf.fps, perf.frameMs, perf.stageCount
 */
export function useShaderPerf(label = 'pipeline') {
  const fps = ref(0)
  const frameMs = ref(0)
  const stageCount = ref(0)

  let lastTime = performance.now()
  let frames = 0
  let accumMs = 0
  let rafId: number | null = null
  let running = false

  const pipeline = useShaderPipelineContext()

  function tick() {
    if (!running) return
    const now = performance.now()
    const delta = now - lastTime
    lastTime = now

    frames++
    accumMs += delta

    if (accumMs >= 500) {
      fps.value = Math.round((frames / accumMs) * 1000)
      frameMs.value = Math.round(accumMs / frames * 10) / 10
      frames = 0
      accumMs = 0
    }

    stageCount.value = pipeline
      ? (pipeline.stagesFor('uv').length + pipeline.stagesFor('fragment').length)
      : 0
    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (running) return
    running = true
    lastTime = performance.now()
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    running = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(start)
  onUnmounted(stop)

  if (import.meta.dev) {
    watch([fps, frameMs, stageCount], ([f, ms, s]) => {
      // eslint-disable-next-line no-console
      console.debug(`[ShaderPerf:${label}] ${f}fps  ${ms}ms/frame  ${s} stages`)
    })
  }

  return { fps, frameMs, stageCount, start, stop }
}
