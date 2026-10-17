<script setup lang="ts">
  import { float, uniform, vec3, vec4 } from 'three/tsl'
  import type { hashBlur as HashBlurFn } from 'three/addons/tsl/display/hashBlur.js'
  import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'

  type HashBlurOptions = NonNullable<Parameters<typeof HashBlurFn>[2]>
  const {
    red = 0.01,
    green = 0.02,
    blue = 0.03,
    order = 0,
  } = defineProps<{
    /** Red channel blur (UV) */
    red?: number
    /** Green channel blur (UV) */
    green?: number
    /** Blue channel blur (UV) */
    blue?: number
    order?: number
  }>()

  const redNode = uniform(red)
  const greenNode = uniform(green)
  const blueNode = uniform(blue)
  watch(
    () => red,
    (v) => {
      redNode.value = v
    }
  )
  watch(
    () => green,
    (v) => {
      greenNode.value = v
    }
  )
  watch(
    () => blue,
    (v) => {
      blueNode.value = v
    }
  )

  useShaderStage((prev) => {
    const r = hashBlur(prev, redNode, { repeats: float(24) } as HashBlurOptions).x
    const g = hashBlur(prev, greenNode, { repeats: float(24) } as HashBlurOptions).y
    const b = hashBlur(prev, blueNode, { repeats: float(24) } as HashBlurOptions).z
    return vec4(vec3(r, g, b), prev.w)
  }, order)
</script>
