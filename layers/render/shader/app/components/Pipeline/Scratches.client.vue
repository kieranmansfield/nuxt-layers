<script setup lang="ts">
  import { abs, float, floor, fract, smoothstep, step, time, uniform, vec2, vec4 } from 'three/tsl'
  import { hash21 } from '../../shaders/common/noise'

  const {
    density = 60,
    intensity = 0.6,
    flicker = 12,
    order = 0,
  } = defineProps<{
    /** Scratch slots across the width */
    density?: number
    /** Scratch brightness */
    intensity?: number
    /** Re-roll rate (per second) */
    flicker?: number
    order?: number
  }>()

  const densityNode = uniform(density)
  const intensityNode = uniform(intensity)
  const flickerNode = uniform(flicker)
  watch(
    () => density,
    (v) => {
      densityNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => flicker,
    (v) => {
      flickerNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const p = pipeline.uvNode.value
    const slot = floor(p.x.mul(densityNode))
    const tick = floor(time.mul(flickerNode))
    const r = hash21(vec2(slot, tick))
    // Only some slots scratch each tick; each is a thin vertical line with a random extent
    const on = step(0.93, r)
    const centre = fract(p.x.mul(densityNode)).sub(0.5)
    const line = float(1).sub(smoothstep(0.02, 0.08, abs(centre)))
    const extent = step(hash21(vec2(slot, tick.add(3))), p.y)
    return vec4(prev.xyz.add(on.mul(line).mul(extent).mul(intensityNode)), prev.w)
  }, order)
</script>
