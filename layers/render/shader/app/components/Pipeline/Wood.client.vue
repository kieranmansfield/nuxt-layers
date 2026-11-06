<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, sin, time, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#8b5e3c',
    colorB = '#4a2e1a',
    ringFrequency = 12,
    noiseScale = 3,
    noiseStrength = 0.4,
    speed = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Number of rings across the UV space */
    ringFrequency?: number
    /** Noise distortion scale */
    noiseScale?: number
    /** Noise displacement strength */
    noiseStrength?: number
    /** Very slow rotation speed for living wood effect */
    speed?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const ringFreqNode = useUniformProp(() => ringFrequency)
  const noiseScaleNode = useUniformProp(() => noiseScale)
  const noiseStrNode = useUniformProp(() => noiseStrength)
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
    const n = fbm2D(uv.mul(noiseScaleNode).add(t)).mul(noiseStrNode)
    // Concentric rings from centre with noise offset
    const dist = uv.sub(0.5).length().add(n)
    const ring = sin(dist.mul(ringFreqNode).mul(Math.PI * 2))
      .mul(0.5)
      .add(0.5)
    return vec4(mix(colorANode, colorBNode, ring), float(1))
  }, order)
</script>
