<script setup lang="ts">
  import type { TSLNode } from '../../types'
  import { mix, uniform, vec4 } from 'three/tsl'
  import { sobel } from 'three/addons/tsl/display/SobelOperatorNode.js'

  const {
    strength = 3,
    glow = 0.25,
    order = 0,
  } = defineProps<{
    /** Edge brightness */
    strength?: number
    /** Original image kept under the lines (0-1) */
    glow?: number
    order?: number
  }>()

  const strengthNode = uniform(strength)
  const glowNode = uniform(glow)
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )
  watch(
    () => glow,
    (v) => {
      glowNode.value = v
    }
  )

  useShaderStage((prev) => {
    const edges = (sobel(prev) as unknown as TSLNode).x.mul(strengthNode)
    const lit = prev.xyz.mul(edges.mul(2).add(glowNode))
    return vec4(mix(lit, lit.mul(1.5), edges), prev.w)
  }, order)
</script>
