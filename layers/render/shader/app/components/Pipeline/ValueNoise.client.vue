<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, time, uniform, vec4 } from 'three/tsl'

  import { valueNoise2D } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 4,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    speed?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const scaleNode = uniform(scale)
  const speedNode = uniform(speed)
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
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const t = valueNoise2D(uv.mul(scaleNode).add(time.mul(speedNode)))
      .mul(0.5)
      .add(0.5)
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>
