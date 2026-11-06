<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { time } from 'three/tsl'

  import { valueNoise2D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 4,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    speed?: number
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const t = valueNoise2D(uv.mul(scaleNode).add(time.mul(speedNode)))
        .mul(0.5)
        .add(0.5)
      return t
    },
    order
  )
</script>
