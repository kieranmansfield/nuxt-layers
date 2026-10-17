<script setup lang="ts">
  import { float, uniform, vec4 } from 'three/tsl'
  import type { hashBlur as HashBlurFn } from 'three/addons/tsl/display/hashBlur.js'
  import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'

  type HashBlurOptions = NonNullable<Parameters<typeof HashBlurFn>[2]>
  const {
    amount = 0.04,
    intensity = 0.8,
    threshold = 0.6,
    order = 0,
  } = defineProps<{
    /** Glow spread (UV) */
    amount?: number
    /** Glow strength */
    intensity?: number
    /** Brightness cut-off (0-1) */
    threshold?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const intensityNode = uniform(intensity)
  const thresholdNode = uniform(threshold)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => threshold,
    (v) => {
      thresholdNode.value = v
    }
  )

  useShaderStage((prev) => {
    const bright = prev.xyz.sub(thresholdNode).max(0)
    const blurred = hashBlur(vec4(bright, 1), amountNode, { repeats: float(24) } as HashBlurOptions)
    return vec4(prev.xyz.add(blurred.xyz.mul(intensityNode)), prev.w)
  }, order)
</script>
