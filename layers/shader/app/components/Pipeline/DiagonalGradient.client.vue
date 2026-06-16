<script setup lang="ts">
  import { Color } from 'three'
  import { cos, float, mix, sin, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    angle = 45,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Gradient angle in degrees (0 = left→right, 90 = bottom→top) */
    angle?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const angleNode = uniform((angle * Math.PI) / 180)
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
    () => angle,
    (v) => {
      angleNode.value = (v * Math.PI) / 180
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const t = uv.x
      .mul(cos(angleNode))
      .add(uv.y.mul(sin(angleNode)))
      .clamp(float(0), float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>
