<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, vec2, vec4 } from 'three/tsl'

  import { roundedRect } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    width = 0.6,
    height = 0.4,
    cornerRadius = 0.05,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    width?: number
    height?: number
    cornerRadius?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const widthNode = useUniformProp(() => width)
  const heightNode = useUniformProp(() => height)
  const cornerNode = useUniformProp(() => cornerRadius)
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
    const mask = roundedRect(uv, [0.5, 0.5], vec2(widthNode, heightNode), cornerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
