<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { polygon } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    sides = 6,
    radius = 0.35,
    softness = 0.01,
    rotation = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Number of sides */
    sides?: number
    radius?: number
    softness?: number
    /** Rotation offset in degrees */
    rotation?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const radiusNode = uniform(radius)
  const softnessNode = uniform(softness)
  const rotationNode = uniform((rotation * Math.PI) / 180)
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
  watch(
    () => rotation,
    (v) => {
      rotationNode.value = (v * Math.PI) / 180
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = polygon(uv, [0.5, 0.5], sides, radiusNode, rotationNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>
