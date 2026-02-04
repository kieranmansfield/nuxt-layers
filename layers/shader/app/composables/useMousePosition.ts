import { useMouse, useWindowSize } from '@vueuse/core'
import { vec2 as tslVec2, uniform } from 'three/tsl'

export interface MousePositionOptions {
  /** Smoothing factor (0-1, lower = smoother) */
  smoothing?: number
  /** Normalize to -1 to 1 range instead of 0 to 1 */
  normalized?: boolean
}

export function useMousePosition(options: MousePositionOptions = {}) {
  const { smoothing = 0.1, normalized = false } = options

  // Use VueUse for mouse and window tracking
  const { x: rawX, y: rawY } = useMouse({ type: 'client' })
  const { width, height } = useWindowSize()

  // Smoothed values
  const mouseX = ref(0.5)
  const mouseY = ref(0.5)

  // TSL uniform nodes for shader use
  const mouseXNode = uniform(0.5)
  const mouseYNode = uniform(0.5)
  const mouseVec2Node = tslVec2(mouseXNode, mouseYNode)

  // Lerp function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  // Compute normalized mouse position
  const normalizedX = computed(() => {
    if (width.value === 0) return 0.5
    const val = rawX.value / width.value
    return normalized ? val * 2 - 1 : val
  })

  const normalizedY = computed(() => {
    if (height.value === 0) return 0.5
    // Flip Y for shader coordinates (bottom = 0, top = 1)
    const val = 1 - rawY.value / height.value
    return normalized ? val * 2 - 1 : val
  })

  let animationFrame: number | null = null

  const animate = () => {
    mouseX.value = lerp(mouseX.value, normalizedX.value, smoothing)
    mouseY.value = lerp(mouseY.value, normalizedY.value, smoothing)

    // Update TSL uniforms
    mouseXNode.value = mouseX.value
    mouseYNode.value = mouseY.value

    animationFrame = requestAnimationFrame(animate)
  }

  onMounted(() => {
    if (import.meta.client) {
      animate()
    }
  })

  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })

  const setPosition = (x: number, y: number) => {
    mouseX.value = x
    mouseY.value = y
    mouseXNode.value = x
    mouseYNode.value = y
  }

  return {
    // Reactive refs (smoothed)
    mouseX: readonly(mouseX),
    mouseY: readonly(mouseY),
    // Raw normalized values (not smoothed)
    rawX: normalizedX,
    rawY: normalizedY,
    // TSL nodes for shader use
    mouseXNode,
    mouseYNode,
    mouseVec2Node,
    // Manual control
    setPosition,
  }
}

export type MousePosition = ReturnType<typeof useMousePosition>
