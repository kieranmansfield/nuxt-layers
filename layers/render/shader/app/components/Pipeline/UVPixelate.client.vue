<script setup lang="ts">
  const { gridSize = 64, order = 0 } = defineProps<{
    /** Number of pixel columns/rows — lower = chunkier pixels */
    gridSize?: number
    order?: number
  }>()

  const gridSizeNode = useUniformProp(() => gridSize)

  useShaderStage((uvIn) => uvIn.mul(gridSizeNode).floor().div(gridSizeNode), order, 'uv')
</script>
