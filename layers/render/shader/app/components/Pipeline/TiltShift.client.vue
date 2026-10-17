<script setup lang="ts">
  import { abs, float, smoothstep, uniform, uv } from 'three/tsl'
  import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'

  const {
    focus = 0.5,
    range = 0.2,
    maxBlur = 0.02,
    order = 0,
  } = defineProps<{
    /** Focus line position (UV y) */
    focus?: number
    /** Half-height of the sharp band */
    range?: number
    /** Blur at the screen edges (UV) */
    maxBlur?: number
    order?: number
  }>()

  const focusNode = uniform(focus)
  const rangeNode = uniform(range)
  const maxBlurNode = uniform(maxBlur)
  watch(
    () => focus,
    (v) => {
      focusNode.value = v
    }
  )
  watch(
    () => range,
    (v) => {
      rangeNode.value = v
    }
  )
  watch(
    () => maxBlur,
    (v) => {
      maxBlurNode.value = v
    }
  )

  useShaderStage((prev) => {
    const d = abs(uv().y.sub(focusNode))
    const k = smoothstep(rangeNode, rangeNode.add(0.3), d)
    return hashBlur(prev, maxBlurNode.mul(k), { repeats: float(24) })
  }, order)
</script>
