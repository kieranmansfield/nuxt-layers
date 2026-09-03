<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { star } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffcc00',
    radius = 0.35,
    points = 5,
    innerRatio = 0.45,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    radius?: number
    /** Number of points */
    points?: number
    /** Inner radius ratio (0–1) */
    innerRatio?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const radiusNode = uniform(radius)
  const innerNode = uniform(innerRatio)
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
    () => innerRatio,
    (v) => {
      innerNode.value = v
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
    const mask = star(uv, [0.5, 0.5], points, innerNode, radiusNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
