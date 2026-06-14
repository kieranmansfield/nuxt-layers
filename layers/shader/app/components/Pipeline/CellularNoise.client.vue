<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, time, uniform, vec4 } from 'three/tsl'

  import { voronoi2D } from '../../shaders/common/noise'

  const {
    colorA = '#000033',
    colorB = '#ffffff',
    scale = 8,
    speed = 0.1,
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
    const { distance } = voronoi2D(uv.add(time.mul(speedNode)), scaleNode)
    return vec4(mix(colorANode, colorBNode, distance.min(float(1))), float(1))
  }, order)
</script>
