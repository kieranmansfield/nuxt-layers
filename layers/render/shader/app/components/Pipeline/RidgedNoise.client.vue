<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { time } from 'three/tsl'

  import { ridgedFbm2d } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 2,
    speed = 0.1,
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
      const n = ridgedFbm2d(uv.mul(scaleNode).add(time.mul(speedNode)))
      return n
    },
    order
  )
</script>
