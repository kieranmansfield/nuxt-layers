<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, sin, time, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#f5f0e8',
    colorB = '#6a5a4a',
    frequency = 5,
    noiseScale = 3,
    noiseStrength = 8,
    sharpness = 4,
    speed = 0,
    order = 0,
  } = defineProps<{
    /** Base (vein background) colour */
    colorA?: string
    /** Vein colour */
    colorB?: string
    /** Marble vein frequency */
    frequency?: number
    /** FBM noise scale for vein turbulence */
    noiseScale?: number
    /** Noise strength applied to sine input */
    noiseStrength?: number
    /** Vein sharpness — higher = thinner veins */
    sharpness?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const freqNode = useUniformProp(() => frequency)
  const noiseScaleNode = useUniformProp(() => noiseScale)
  const noiseStrNode = useUniformProp(() => noiseStrength)
  const sharpNode = useUniformProp(() => sharpness)
  const speedNode = useUniformProp(() => speed)
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const n = fbm2D(uv.mul(noiseScaleNode).add(t))
    // Sine + noise offset creates the vein pattern
    const vein = sin(uv.x.mul(freqNode).add(n.mul(noiseStrNode)))
      .abs()
      .pow(sharpNode)
    return vec4(mix(colorANode, colorBNode, vein), float(1))
  }, order)
</script>
