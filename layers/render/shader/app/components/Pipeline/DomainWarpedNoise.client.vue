<script setup lang="ts">
  import { time } from 'three/tsl'

  import { domainWarp2D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 2,
    warpStrength = 0.5,
    warpScale = 2,
    speed = 0.1,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    warpStrength?: number
    warpScale?: number
    speed?: number
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const warpStrNode = useUniformProp(() => warpStrength)
  const warpScaleNode = useUniformProp(() => warpScale)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const animated = uv.add(time.mul(speedNode))
      const n = domainWarp2D(animated.mul(scaleNode), warpStrNode, warpScaleNode).mul(0.5).add(0.5)
      return n
    },
    order
  )
</script>
