<script setup lang="ts">
  import { Color } from 'three'
  import { uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    color = '#ff8844',
    opacity = 1,
    order = 0,
  } = defineProps<{
    /** Tint colour — multiplied against the existing colour */
    color?: string
    /** Blend between original (0) and fully tinted (1) */
    opacity?: number
    order?: number
  }>()

  const colorNode = hexToVec3Uniform(color)
  const opacityNode = uniform(opacity)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

  useShaderStage((prev) => {
    const tinted = prev.xyz.mul(colorNode)
    return vec4(prev.xyz.mix(tinted, opacityNode), prev.w)
  }, order)
</script>
