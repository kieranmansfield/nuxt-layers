<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, smoothstep, uniform, vec4 } from 'three/tsl'

  import { sdEquilateralTriangle } from '../../shaders/common/sdf'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    size = 0.35,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    size?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const sizeNode = uniform(size)
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
    () => size,
    (v) => {
      sizeNode.value = v
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
    const d = sdEquilateralTriangle(uv.sub(0.5), sizeNode)
    const mask = smoothstep(softnessNode, softnessNode.negate(), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
