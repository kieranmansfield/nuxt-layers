<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, time, uniform, vec3, vec4 } from 'three/tsl'

  import { gradientNoise3D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 3,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    speed?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
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
    const t = time.mul(speedNode)
    const n = gradientNoise3D(vec3(uv.mul(scaleNode), t))
      .mul(0.5)
      .add(0.5)
    return vec4(mix(colorANode, colorBNode, n), float(1))
  }, order)
</script>
