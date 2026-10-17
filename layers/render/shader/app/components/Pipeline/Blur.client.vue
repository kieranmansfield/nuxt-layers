<script setup lang="ts">
  import { float, uniform } from 'three/tsl'
  import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'

  const {
    amount = 0.02,
    repeats = 45,
    order = 0,
  } = defineProps<{
    /** Blur radius in UV units */
    amount?: number
    /** Samples per pixel — higher is smoother and slower */
    repeats?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )

  // Source-texture block: hashBlur renders the stages so far to a render target
  // (via convertToTexture) and re-samples it in a single pass.
  useShaderStage((prev) => hashBlur(prev, amountNode, { repeats: float(repeats) }), order)
</script>
