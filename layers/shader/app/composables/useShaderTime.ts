/* eslint-disable no-restricted-imports */
import { uniform } from 'three/tsl'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export interface ShaderTimeOptions {
  autoStart?: boolean
  speed?: number
}

/**
 * Controllable time for shader animations
 */
export function useShaderTime(options: ShaderTimeOptions = {}) {
  const { autoStart = true, speed: initialSpeed = 1 } = options

  const elapsed = ref(0)
  const speed = ref(initialSpeed)
  const isRunning = ref(false)

  let startTime = 0
  let pausedTime = 0
  let animationFrameId: number | null = null

  // Create uniform nodes
  const elapsedNode = uniform(0)
  const speedNode = uniform(initialSpeed)

  // Scaled time (elapsed * speed)
  const scaled = computed(() => elapsed.value * speed.value)
  const scaledNode = uniform(0)

  function tick() {
    if (!isRunning.value) return

    const now = performance.now() / 1000
    elapsed.value = (now - startTime) * speed.value + pausedTime

    // Update uniform nodes
    elapsedNode.value = elapsed.value
    scaledNode.value = elapsed.value

    animationFrameId = requestAnimationFrame(tick)
  }

  function start() {
    if (isRunning.value) return

    startTime = performance.now() / 1000
    isRunning.value = true
    tick()
  }

  function pause() {
    if (!isRunning.value) return

    pausedTime = elapsed.value
    isRunning.value = false

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  function resume() {
    if (isRunning.value) return

    startTime = performance.now() / 1000
    isRunning.value = true
    tick()
  }

  function reset() {
    pause()
    elapsed.value = 0
    pausedTime = 0
    elapsedNode.value = 0
    scaledNode.value = 0
  }

  function setSpeed(newSpeed: number) {
    // Preserve current position when changing speed
    pausedTime = elapsed.value
    startTime = performance.now() / 1000
    speed.value = newSpeed
    speedNode.value = newSpeed
  }

  function setTime(time: number) {
    pausedTime = time
    startTime = performance.now() / 1000
    elapsed.value = time
    elapsedNode.value = time
    scaledNode.value = time
  }

  // Watch speed changes
  watch(speed, (newSpeed) => {
    speedNode.value = newSpeed
  })

  onMounted(() => {
    if (autoStart) {
      start()
    }
  })

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    // Reactive values
    elapsed: readonly(elapsed),
    speed,
    scaled,
    isRunning: readonly(isRunning),

    // TSL uniform nodes
    elapsedNode,
    speedNode,
    scaledNode,

    // Controls
    start,
    pause,
    resume,
    reset,
    setSpeed,
    setTime,
  }
}

/**
 * Simple global time singleton for basic use cases
 */
let globalTime: ReturnType<typeof useShaderTime> | null = null

export function useGlobalShaderTime() {
  if (!globalTime) {
    globalTime = useShaderTime({ autoStart: true })
  }
  return globalTime
}
