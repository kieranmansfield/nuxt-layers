<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    rotation = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Rotation offset in degrees */
    rotation?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
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
    () => rotation,
    (v) => {
      rotationNode.value = (v * Math.PI) / 180
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const centered = uv.sub(0.5)
    const angle = centered.y.atan(centered.x).add(rotationNode)
    const t = angle.div(Math.PI * 2).fract()
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>
