<script setup lang="ts">
  import { clamp, mix, vec4 } from 'three/tsl'

  const {
    colorCenter = '#ffffff',
    colorEdge = '#000000',
    radius = 0.7,
    order = 0,
  } = defineProps<{
    colorCenter?: string
    colorEdge?: string
    radius?: number
    order?: number
  }>()

  const colorCenterNode = useColorProp(() => colorCenter)
  const colorEdgeNode = useColorProp(() => colorEdge)
  const radiusNode = useUniformProp(() => radius)

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((_prev) => {
    const t = clamp(uvNode.value.sub(0.5).length().div(radiusNode), 0, 1)
    return vec4(mix(colorCenterNode, colorEdgeNode, t), 1.0)
  }, order)
</script>
