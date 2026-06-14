<script setup lang="ts">
  import { float, sin, smoothstep, time, uniform, vec2 } from 'three/tsl'

  /**
   * Gentle eased scale oscillation — softer than UVPulse.
   * Uses a smoothstepped sine so the scale dwells at min/max rather than
   * passing through them instantly.
   */
  const {
    amount = 0.05,
    speed = 0.8,
    order = 0,
  } = defineProps<{
    /** Max scale deviation from 1.0 */
    amount?: number
    /** Breath cycle speed in radians per second */
    speed?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const speedNode = uniform(speed)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => {
      const raw = sin(time.mul(speedNode)).mul(0.5).add(0.5)
      const eased = smoothstep(float(0), float(1), raw)
      const scale = float(1).add(eased.sub(0.5).mul(amountNode.mul(2)))
      const centered = uvIn.sub(0.5).div(scale).add(0.5)
      return vec2(centered.x, centered.y)
    },
    order,
    'uv'
  )
</script>
