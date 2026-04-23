import { Vector2 } from 'three'
import { float, time, uniform, vec3 } from 'three/tsl'

export interface SunDirectionOptions {
  /** Animation speed (radians/second). Only used when useMouseY is false. */
  speed?: number
  /** Drive elevation from mouse Y instead of time. */
  useMouseY?: boolean
}

/**
 * Returns a live TSL vec3 node representing a normalised sun direction.
 *
 * Animated mode (default): elevation oscillates via sin(time * speed).
 * Mouse mode: elevation tracks mouse Y position.
 *
 * The guide formula: rotX(vec3(0,0,1), angle * 5 + 0.5)
 * → vec3(0, -sin(a), cos(a))  where a = angle * 5 + 0.5
 *
 * @example
 * const sunDir = useSunDirectionUniform({ speed: 0.05 })
 * // Pass sunDir directly to SkyAtmosphere or any shader that needs sun position.
 */
export function useSunDirectionUniform(options: SunDirectionOptions = {}) {
  const { speed = 0.05, useMouseY = false } = options

  if (useMouseY) {
    // @ts-ignore
    const mouse = uniform(new Vector2(0.5, 0.5))

    onMounted(() => {
      const onMove = (e: MouseEvent) => {
        // @ts-ignore
        mouse.value.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight)
      }
      window.addEventListener('mousemove', onMove)
      onUnmounted(() => window.removeEventListener('mousemove', onMove))
    })

    // angle = -(mouseY - 0.5) — top of screen = sun high, bottom = sun low
    const angle = mouse.y.oneMinus().sub(0.5)
    const a = angle.mul(5).add(0.5)
    // @ts-ignore
    return vec3(float(0), a.sin().negate(), a.cos())
  }

  // Animated mode — pure TSL expression, no JS uniform needed
  // @ts-ignore
  const speedNode = uniform(speed)
  const angle = time.mul(speedNode).sin().div(8).sub(0.2)
  const a = angle.mul(5).add(0.5)
  // @ts-ignore
  return vec3(float(0), a.sin().negate(), a.cos())
}
