<script setup lang="ts">
  import { Vector2 } from 'three'
  import { uniform } from 'three/tsl'

  const {
    repeatX = 2,
    repeatY = 2,
    order = 0,
  } = defineProps<{
    repeatX?: number
    repeatY?: number
    order?: number
  }>()

  const repeatVal = new Vector2(repeatX, repeatY)
  const repeatNode = uniform(repeatVal)
  watch(
    () => [repeatX, repeatY] as const,
    ([x, y]) => {
      repeatNode.value.set(x, y)
    }
  )

  useShaderStage((uvIn) => uvIn.mul(repeatNode).fract(), order, 'uv')
</script>
