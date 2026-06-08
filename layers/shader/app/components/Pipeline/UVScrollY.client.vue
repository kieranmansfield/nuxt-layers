<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { fract, time, uniform, vec2 } from 'three/tsl'

  const props = withDefaults(
    defineProps<{
      /** Scroll speed (UV units per second, positive = up) */
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

  useShaderStage((uvIn) => vec2(uvIn.x, fract(uvIn.y.add(time.mul(speedNode)))), props.order, 'uv')
</script>
