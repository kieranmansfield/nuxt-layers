<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  const {
    columns = 6,
    factor = 0.15,
    order = 0,
  } = defineProps<{
    /** Number of columns to divide into */
    columns?: number
    /** Vertical offset multiplied by column index */
    factor?: number
    order?: number
  }>()

  const columnsNode = uniform(columns)
  const factorNode = uniform(factor)
  watch(
    () => columns,
    (v) => {
      columnsNode.value = v
    }
  )
  watch(
    () => factor,
    (v) => {
      factorNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => {
      const col = uvIn.x.mul(columnsNode).floor()
      return vec2(uvIn.x, uvIn.y.add(col.mul(factorNode)))
    },
    order,
    'uv'
  )
</script>
