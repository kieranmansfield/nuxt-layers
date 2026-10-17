<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  const {
    stretchX = 1.5,
    stretchY = 1,
    order = 0,
  } = defineProps<{
    /** Horizontal stretch factor */
    stretchX?: number
    /** Vertical stretch factor */
    stretchY?: number
    order?: number
  }>()

  const stretchXNode = uniform(stretchX)
  const stretchYNode = uniform(stretchY)
  watch(
    () => stretchX,
    (v) => {
      stretchXNode.value = v
    }
  )
  watch(
    () => stretchY,
    (v) => {
      stretchYNode.value = v
    }
  )

  useShaderStage((uvIn) => uvIn.sub(0.5).div(vec2(stretchXNode, stretchYNode)).add(0.5), order, 'uv')
</script>
