<script setup lang="ts">
  import { abs, uniform, vec2 } from 'three/tsl'

  const {
    axisX = 0.5,
    order = 0,
  } = defineProps<{
    /** Mirror axis position on X (UV) */
    axisX?: number
    order?: number
  }>()

  const axisXNode = uniform(axisX)
  watch(
    () => axisX,
    (v) => {
      axisXNode.value = v
    }
  )

  useShaderStage((uvIn) => vec2(axisXNode.sub(abs(uvIn.x.sub(axisXNode))), uvIn.y), order, 'uv')
</script>
