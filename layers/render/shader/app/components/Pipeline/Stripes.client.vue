<script setup lang="ts">
  import { stripes } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    frequency = 10,
    thickness = 0.5,
    angle = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    frequency?: number
    /** Fraction of each stripe that is colorB (0–1) */
    thickness?: number
    /** Angle in degrees */
    angle?: number
    order?: number
  }>()

  const freqNode = useUniformProp(() => frequency)
  const thickNode = useUniformProp(() => thickness)
  const angleNode = useUniformProp(() => (angle * Math.PI) / 180)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = stripes(uv, freqNode, thickNode, angleNode)
      return mask
    },
    order
  )
</script>
