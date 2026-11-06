<script setup lang="ts">
  import { float, time } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  /** Linear gradient with per-pixel FBM noise offset — living, organic gradient. */
  const {
    colorA = '#1a0a5a',
    colorB = '#ff8866',
    angle = 0,
    noiseStrength = 0.3,
    noiseScale = 2,
    speed = 0.15,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Gradient axis angle in degrees */
    angle?: number
    /** Noise displacement strength */
    noiseStrength?: number
    /** Noise input scale */
    noiseScale?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const angleNode = useUniformProp(() => (angle * Math.PI) / 180)
  const noiseStrNode = useUniformProp(() => noiseStrength)
  const noiseScaleNode = useUniformProp(() => noiseScale)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const n = fbm2D(uv.mul(noiseScaleNode).add(time.mul(speedNode)))
      const base = uv.x.mul(angleNode.cos()).add(uv.y.mul(angleNode.sin()))
      const t = base.add(n.mul(noiseStrNode)).clamp(float(0), float(1))
      return t
    },
    order
  )
</script>
