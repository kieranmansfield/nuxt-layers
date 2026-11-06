<script setup lang="ts">
  import { floor, fract, sin, time, vec3, vec4 } from 'three/tsl'

  /**
   * VHS colour bleed + horizontal noise drift.
   * Shifts R/B channels horizontally by a noise-driven amount and adds scanline banding.
   */
  const {
    bleedStrength = 0.015,
    noiseFreq = 8,
    trackingNoise = 0.3,
    speed = 1,
    order = 0,
  } = defineProps<{
    /** Channel bleed strength */
    bleedStrength?: number
    /** Horizontal noise frequency */
    noiseFreq?: number
    /** Tracking error intensity */
    trackingNoise?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const bleedNode = useUniformProp(() => bleedStrength)
  const noiseFreqNode = useUniformProp(() => noiseFreq)
  const trackingNode = useUniformProp(() => trackingNoise)
  const speedNode = useUniformProp(() => speed)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)

    // Horizontal tracking noise — quantised to simulate tape jitter
    const scanLine = floor(uv.y.mul(noiseFreqNode))
    const jitter = fract(sin(scanLine.add(t.mul(7.1731)).mul(43758.5453))).sub(0.5)
    const drift = jitter.mul(trackingNode).mul(bleedNode)

    // Channel separation: R shifts right, B shifts left relative to G
    const rBleed = fract(prev.r.add(drift))
    const bBleed = fract(prev.b.sub(drift))

    // Scanline brightness variation
    const scanBrightness = sin(uv.y.mul(400).add(t.mul(3)))
      .mul(0.03)
      .add(1)

    return vec4(vec3(rBleed, prev.g, bBleed).mul(scanBrightness), prev.w)
  }, order)
</script>
