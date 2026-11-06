<script setup lang="ts">
  import { float, sin, time, vec2 } from 'three/tsl'

  /**
   * Oscillating UV scale over time — the UV breathes in and out.
   * scale = 1 + sin(time * speed) * amount
   */
  const {
    amount = 0.1,
    speed = 2,
    order = 0,
  } = defineProps<{
    /** Pulse amplitude (fraction of UV range) */
    amount?: number
    /** Pulse speed in radians per second */
    speed?: number
    order?: number
  }>()

  const amountNode = useUniformProp(() => amount)
  const speedNode = useUniformProp(() => speed)

  useShaderStage(
    (uvIn) => {
      const scale = float(1).add(sin(time.mul(speedNode)).mul(amountNode))
      const centered = uvIn.sub(0.5).div(scale).add(0.5)
      return vec2(centered.x, centered.y)
    },
    order,
    'uv'
  )
</script>
