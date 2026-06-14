<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { roundedRect } from '../../shaders/common/shapes'

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

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const widthNode = uniform(width)
  const heightNode = uniform(height)
  const cornerNode = uniform(cornerRadius)
  const softnessNode = uniform(softness)
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
  watch(
    () => width,
    (v) => {
      widthNode.value = v
    }
  )
  watch(
    () => height,
    (v) => {
      heightNode.value = v
    }
  )
  watch(
    () => cornerRadius,
    (v) => {
      cornerNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = roundedRect(uv, [0.5, 0.5], widthNode, cornerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
