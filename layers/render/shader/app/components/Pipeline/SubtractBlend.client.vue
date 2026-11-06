<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { clamp, vec4 } from 'three/tsl'

  import { blendSubtract } from '../../shaders/common/blend'

  const {
    color = '#808080',
    opacity = 1,
    order = 0,
  } = defineProps<{
    color?: string
    opacity?: number
    order?: number
  }>()

  const colorNode = useColorProp(() => color)
  const opacityNode = useUniformProp(() => opacity)

  useShaderStage(
    (prev) => clamp(vec4(blendSubtract(prev.xyz, colorNode, opacityNode), prev.w), 0, 1),
    order
  )
</script>
