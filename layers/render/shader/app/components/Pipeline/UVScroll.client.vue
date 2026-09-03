<script setup lang="ts">
  import { Vector2 } from 'three'
  import { time, uniform } from 'three/tsl'

  const {
    speedX = 0,
    speedY = 0.1,
    order = 0,
  } = defineProps<{
    speedX?: number
    speedY?: number
    order?: number
  }>()

  const speedVal = new Vector2(speedX, speedY)
  const speedNode = uniform(speedVal)
  watch(
    () => [speedX, speedY] as const,
    ([x, y]) => {
      speedNode.value.set(x, y)
    }
  )

  useShaderStage((uvIn) => uvIn.add(speedNode.mul(time)).fract(), order, 'uv')
</script>
