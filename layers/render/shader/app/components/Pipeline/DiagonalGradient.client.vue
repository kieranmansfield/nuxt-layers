<script setup lang="ts">
  import { cos, float, sin } from 'three/tsl'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    angle = 45,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Gradient angle in degrees (0 = left→right, 90 = bottom→top) */
    angle?: number
    order?: number
  }>()

  const angleNode = useUniformProp(() => (angle * Math.PI) / 180)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const t = uv.x
        .mul(cos(angleNode))
        .add(uv.y.mul(sin(angleNode)))
        .clamp(float(0), float(1))
      return t
    },
    order
  )
</script>
