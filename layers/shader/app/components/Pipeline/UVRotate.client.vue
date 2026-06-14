<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  const {
    angle = 0,
    pivotX = 0.5,
    pivotY = 0.5,
    order = 0,
  } = defineProps<{
    /** Rotation in degrees */
    angle?: number
    pivotX?: number
    pivotY?: number
    order?: number
  }>()

  const angleNode = uniform(angle * (Math.PI / 180))
  watch(
    () => angle,
    (v) => {
      angleNode.value = v * (Math.PI / 180)
    }
  )

  useShaderStage(
    (uvIn) => {
      const pivot = vec2(pivotX, pivotY)
      const cosA = angleNode.cos()
      const sinA = angleNode.sin()
      const centered = uvIn.sub(pivot)
      return vec2(
        centered.x.mul(cosA).sub(centered.y.mul(sinA)),
        centered.x.mul(sinA).add(centered.y.mul(cosA))
      ).add(pivot)
    },
    order,
    'uv'
  )
</script>
