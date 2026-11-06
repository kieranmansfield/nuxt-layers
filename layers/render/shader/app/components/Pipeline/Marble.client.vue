<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { sin, time } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

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

  const freqNode = useUniformProp(() => frequency)
  const noiseScaleNode = useUniformProp(() => noiseScale)
  const noiseStrNode = useUniformProp(() => noiseStrength)
  const sharpNode = useUniformProp(() => sharpness)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const t = time.mul(speedNode)
      const n = fbm2D(uv.mul(noiseScaleNode).add(t))
      // Sine + noise offset creates the vein pattern
      const vein = sin(uv.x.mul(freqNode).add(n.mul(noiseStrNode)))
        .abs()
        .pow(sharpNode)
      return vein
    },
    order
  )
</script>
