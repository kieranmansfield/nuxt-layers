<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  const {
    scale = 1,
    pivotX = 0.5,
    pivotY = 0.5,
    order = 0,
  } = defineProps<{
    scale?: number
    pivotX?: number
    pivotY?: number
    order?: number
  }>()

  const scaleNode = uniform(scale)
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => {
      const pivot = vec2(pivotX, pivotY)
      return uvIn.sub(pivot).div(scaleNode).add(pivot)
    },
    order,
    'uv'
  )
</script>
