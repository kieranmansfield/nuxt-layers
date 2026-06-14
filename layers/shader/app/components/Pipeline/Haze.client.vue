<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, smoothstep, uniform, vec4 } from 'three/tsl'

  /**
   * Edge haze — additive fog/bloom at screen boundaries.
   * Useful for dreamlike or atmospheric borders.
   */
  const {
    color = '#ffffff',
    reach = 0.4,
    intensity = 0.3,
    order = 0,
  } = defineProps<{
    /** Haze tint colour */
    color?: string
    /** How far inward the haze reaches (0 = edge only, 1 = full screen) */
    reach?: number
    /** Haze brightness */
    intensity?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorNode = toVec3Node(color)
  const reachNode = uniform(reach)
  const intensityNode = uniform(intensity)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => reach,
    (v) => {
      reachNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value

    // Horizontal edge proximity
    const edgeX = smoothstep(reachNode, float(0), uv.x).add(
      smoothstep(float(1).sub(reachNode), float(1), uv.x)
    )
    // Vertical edge proximity
    const edgeY = smoothstep(reachNode, float(0), uv.y).add(
      smoothstep(float(1).sub(reachNode), float(1), uv.y)
    )

    const edgeMask = edgeX.add(edgeY).clamp(0, 1).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(edgeMask)), prev.w)
  }, order)
</script>
