<script setup lang="ts">
  import { fract, time, uniform, vec2 } from 'three/tsl'

  const { speed = 0.1, order = 0 } = defineProps<{
    /** Scroll speed (UV units per second, positive = right) */
    speed?: number
    order?: number
  }>()

  const speedNode = uniform(speed)
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage((uvIn) => vec2(fract(uvIn.x.add(time.mul(speedNode))), uvIn.y), order, 'uv')
</script>
