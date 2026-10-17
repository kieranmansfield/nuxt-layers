<script setup lang="ts">
  import { floor, float, step, time, uniform, vec2 } from 'three/tsl'

  import { hash21 } from '../../shaders/common/noise'

  const {
    amount = 0.04,
    bands = 24,
    speed = 8,
    order = 0,
  } = defineProps<{
    /** Maximum horizontal displacement of a glitched band (UV units) */
    amount?: number
    /** Number of horizontal bands */
    bands?: number
    /** How quickly the glitch pattern changes (steps per second) */
    speed?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const bandsNode = uniform(bands)
  const speedNode = uniform(speed)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => bands,
    (v) => {
      bandsNode.value = v
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
      const band = floor(uvIn.y.mul(bandsNode))
      const tick = floor(time.mul(speedNode))
      const seed = vec2(band, tick)
      // ~1 in 4 bands glitch per tick, each shifted by a signed random offset
      const active = step(float(0.75), hash21(seed))
      const shift = hash21(seed.add(7.13)).sub(0.5).mul(2).mul(amountNode).mul(active)
      return vec2(uvIn.x.add(shift), uvIn.y)
    },
    order,
    'uv'
  )
</script>
