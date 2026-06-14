<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, time, uniform, vec4 } from 'three/tsl'

  import { domainWarp2D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 2,
    warpStrength = 0.5,
    warpScale = 2,
    speed = 0.1,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    warpStrength?: number
    warpScale?: number
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
  const warpStrNode = uniform(warpStrength)
  const warpScaleNode = uniform(warpScale)
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
    () => warpStrength,
    (v) => {
      warpStrNode.value = v
    }
  )
  watch(
    () => warpScale,
    (v) => {
      warpScaleNode.value = v
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
    const animated = uv.add(time.mul(speedNode))
    const n = domainWarp2D(animated.mul(scaleNode), warpStrNode, warpScaleNode).mul(0.5).add(0.5)
    return vec4(mix(colorANode, colorBNode, n), float(1))
  }, order)
</script>
