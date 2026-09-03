<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, smoothstep, uniform, vec4 } from 'three/tsl'

  import { sdHexagon } from '../../shaders/common/sdf'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    radius = 0.35,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    radius?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const radiusNode = uniform(radius)
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
    () => radius,
    (v) => {
      radiusNode.value = v
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
    const d = sdHexagon(uv.sub(0.5), radiusNode)
    const mask = smoothstep(softnessNode, softnessNode.negate(), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
