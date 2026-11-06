<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { sin, time } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

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

  const ringFreqNode = useUniformProp(() => ringFrequency)
  const noiseScaleNode = useUniformProp(() => noiseScale)
  const noiseStrNode = useUniformProp(() => noiseStrength)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const t = time.mul(speedNode)
      const n = fbm2D(uv.mul(noiseScaleNode).add(t)).mul(noiseStrNode)
      // Concentric rings from centre with noise offset
      const dist = uv.sub(0.5).length().add(n)
      const ring = sin(dist.mul(ringFreqNode).mul(Math.PI * 2))
        .mul(0.5)
        .add(0.5)
      return ring
    },
    order
  )
</script>
