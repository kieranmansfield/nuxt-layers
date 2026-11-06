<script setup lang="ts">
  const {
    colorA = '#000000',
    colorB = '#ffffff',
    rotation = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Rotation offset in degrees */
    rotation?: number
    order?: number
  }>()

  const rotationNode = useUniformProp(() => (rotation * Math.PI) / 180)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const centered = uv.sub(0.5)
      const angle = centered.y.atan(centered.x).add(rotationNode)
      const t = angle.div(Math.PI * 2).fract()
      return t
    },
    order
  )
</script>
