<script setup lang="ts">
  import { cos, sin, time, uniform, vec2 } from 'three/tsl'

  /**
   * Rotates UV around a centre point continuously over time.
   * Distinct from UVRotate (static angle) — this is always animated.
   */
  const { speed = 0.5, order = 0 } = defineProps<{
    /** Orbit speed in radians per second */
    speed?: number
    order?: number
  }>()

  const speedNode = uniform(speed)
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => {
      const angle = time.mul(speedNode)
      const c = cos(angle)
      const s = sin(angle)
      const centered = uvIn.sub(0.5)
      return vec2(
        centered.x.mul(c).sub(centered.y.mul(s)),
        centered.x.mul(s).add(centered.y.mul(c))
      ).add(0.5)
    },
    order,
    'uv'
  )
</script>
