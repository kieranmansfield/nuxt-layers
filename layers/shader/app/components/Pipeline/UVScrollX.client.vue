<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { fract, time, uniform, vec2 } from 'three/tsl'

  const props = withDefaults(
    defineProps<{
      /** Scroll speed (UV units per second, positive = right) */
      speed?: number
      order?: number
    }>(),
    { speed: 0.1, order: 0 }
  )

  const speedNode = uniform(props.speed)
  watch(
    () => props.speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage((uvIn) => vec2(fract(uvIn.x.add(time.mul(speedNode))), uvIn.y), props.order, 'uv')
</script>
