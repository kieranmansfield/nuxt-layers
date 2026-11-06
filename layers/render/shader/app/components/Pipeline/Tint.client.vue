<script setup lang="ts">
  import { vec4 } from 'three/tsl'

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

  const colorNode = useColorProp(() => color)
  const opacityNode = useUniformProp(() => opacity)

  useShaderStage((prev) => {
    const tinted = prev.xyz.mul(colorNode)
    return vec4(prev.xyz.mix(tinted, opacityNode), prev.w)
  }, order)
</script>
