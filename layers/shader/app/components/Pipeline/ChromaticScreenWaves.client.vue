<script setup lang="ts">
  import { float, sin, time, uniform, vec3, vec4 } from 'three/tsl'

  import type { TSLNode } from '../../shaders/types'

  /**
   * Per-channel animated sine waves along the Y axis — the CRT chromatic oscillation effect.
   * Each RGB channel gets its own phase offset, producing subtle chromatic breathing.
   * Pattern: R: sin(freq/res * uv.y + (-time*speed - phaseOffset))
   */
  const {
    amplitude = 0.075,
    frequency = 20,
    speed = 2,
    phaseOffset = 0.4,
    order = 0,
  } = defineProps<{
    /** Wave amplitude (fraction of screen) */
    amplitude?: number
    /** Number of wave cycles across the screen height */
    frequency?: number
    /** Wave scroll speed */
    speed?: number
    /** Phase separation between RGB channels (radians) */
    phaseOffset?: number
    order?: number
  }>()

  const ampNode = uniform(amplitude)
  const freqNode = uniform(frequency)
  const speedNode = uniform(speed)
  const phaseNode = uniform(phaseOffset)
  watch(
    () => amplitude,
    (v) => {
      ampNode.value = v
    }
  )
  watch(
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => phaseOffset,
    (v) => {
      phaseNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode).negate()

    const base = freqNode.mul(uvCurrent.y)
    const r: TSLNode = sin(base.add(t.sub(phaseNode)))
      .mul(ampNode)
      .add(float(1).sub(ampNode))
    const g: TSLNode = sin(base.add(t)).mul(ampNode).add(float(1).sub(ampNode))
    const b: TSLNode = sin(base.add(t.add(phaseNode)))
      .mul(ampNode)
      .add(float(1).sub(ampNode))

    return vec4(prev.xyz.mul(vec3(r, g, b)), prev.w)
  }, order)
</script>
