<script setup lang="ts">
  import { mix, vec4 } from 'three/tsl'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    axis = 'y',
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    axis?: 'x' | 'y'
    order?: number
  }>()

  const colorANode = useColorProp(() => colorA)
  const colorBNode = useColorProp(() => colorB)

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((_prev) => {
    const t = axis === 'x' ? uvNode.value.x : uvNode.value.y
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  }, order)
</script>
