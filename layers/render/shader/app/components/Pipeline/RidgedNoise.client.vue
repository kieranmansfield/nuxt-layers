<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, time, uniform, vec4 } from 'three/tsl'

  import { ridgedFbm2d } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 2,
    speed = 0.1,
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
    const n = ridgedFbm2d(uv.mul(scaleNode).add(time.mul(speedNode)))
    return vec4(mix(colorANode, colorBNode, n), float(1))
  }, order)
</script>
