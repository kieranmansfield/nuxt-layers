import { Vector2 } from 'three'
import { uniform } from 'three/tsl'

/**
 * Unsmoothed vec2 uniform tracking the pointer across the window, 0–1 with Y up
 * (bottom = 0). Starts centred at (0.5, 0.5). For a lerped version see useMousePosition.
 */
export function useWindowMouseUniform() {
  const mouse = uniform(new Vector2(0.5, 0.5))

  const onMove = (e: MouseEvent) => {
    mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMove)
    onUnmounted(() => window.removeEventListener('mousemove', onMove))
  })

  return mouse
}
