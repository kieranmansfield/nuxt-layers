<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, smoothstep, time, uniform, vec4 } from 'three/tsl'

  import { voronoi2D } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  /** Voronoi cell edge lines only — the cell boundaries as thin lines. */
  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 8,
    edgeWidth = 0.05,
    speed = 0.1,
    order = 0,
  } = defineProps<{
    /** Cell background colour */
    colorA?: string
    /** Edge line colour */
    colorB?: string
    scale?: number
    /** Edge line thickness */
    edgeWidth?: number
    speed?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const scaleNode = uniform(scale)
  const edgeNode = uniform(edgeWidth)
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
    () => edgeWidth,
    (v) => {
      edgeNode.value = v
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
    // Edge = near-zero distance → smooth threshold
    const edge = smoothstep(edgeNode, edgeNode.mul(0.1), distance)
    return vec4(mix(colorANode, colorBNode, edge), float(1))
  }, order)
</script>
