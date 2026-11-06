<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, vec4 } from 'three/tsl'

  import { ring } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    innerRadius = 0.25,
    outerRadius = 0.4,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    innerRadius?: number
    outerRadius?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const innerNode = useUniformProp(() => innerRadius)
  const outerNode = useUniformProp(() => outerRadius)
  const softnessNode = useUniformProp(() => softness)
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = ring(uv, [0.5, 0.5], innerNode, outerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
