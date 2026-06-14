<script setup lang="ts">
  import { Color } from 'three'
  import { clamp, mix, uniform, vec4 } from 'three/tsl'

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

  const colorCenterVal = new Color(colorCenter)
  const colorEdgeVal = new Color(colorEdge)
  const colorCenterNode = uniform(colorCenterVal)
  const colorEdgeNode = uniform(colorEdgeVal)
  const radiusNode = uniform(radius)

  watch(
    () => colorCenter,
    (v) => {
      colorCenterNode.value.set(v)
    }
  )
  watch(
    () => colorEdge,
    (v) => {
      colorEdgeNode.value.set(v)
    }
  )
  watch(
    () => radius,
    (v) => {
      radiusNode.value = v
    }
  )

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((_prev) => {
    const t = clamp(uvNode.value.sub(0.5).length().div(radiusNode), 0, 1)
    return vec4(mix(colorCenterNode, colorEdgeNode, t), 1.0)
  }, order)
</script>
