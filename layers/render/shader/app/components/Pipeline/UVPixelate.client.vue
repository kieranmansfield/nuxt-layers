<script setup lang="ts">
  import { uniform } from 'three/tsl'

  const { gridSize = 64, order = 0 } = defineProps<{
    /** Number of pixel columns/rows — lower = chunkier pixels */
    gridSize?: number
    order?: number
  }>()

  const gridSizeNode = uniform(gridSize)
  watch(
    () => gridSize,
    (v) => {
      gridSizeNode.value = v
    }
  )

  useShaderStage((uvIn) => uvIn.mul(gridSizeNode).floor().div(gridSizeNode), order, 'uv')
</script>
