<script setup lang="ts">
  import { Color, Vector2 } from 'three'
  import { cos, float, smoothstep, uniform, vec2, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  /**
   * Radial god rays — procedural volumetric light shafts emanating from a source point.
   * Uses angular spokes in UV space to approximate crepuscular rays.
   */
  const {
    position = [0.5, 0.9],
    color = '#fff9e0',
    intensity = 0.35,
    rayCount = 12,
    decay = 2.0,
    order = 0,
  } = defineProps<{
    /** Light source UV position */
    position?: [number, number]
    /** Ray colour */
    color?: string
    /** Ray brightness */
    intensity?: number
    /** Number of ray spokes */
    rayCount?: number
    /** Radial decay rate */
    decay?: number
    order?: number
  }>()

  const posNode = uniform(new Vector2(...position))
  const colorNode = hexToVec3Uniform(color)
  const intensityNode = uniform(intensity)
  const rayCountNode = uniform(rayCount)
  const decayNode = uniform(decay)
  watch(
    () => position,
    ([x, y]) => {
      posNode.value.set(x, y)
    }
  )
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => rayCount,
    (v) => {
      rayCountNode.value = v
    }
  )
  watch(
    () => decay,
    (v) => {
      decayNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const src = vec2(posNode.x, posNode.y)
    const dir = uv.sub(src)
    const dist = dir.length()

    // Angular spokes: cos(angle * rayCount) drives streak pattern
    const angle = dir.y.atan(dir.x)
    const spoke = cos(angle.mul(rayCountNode)).mul(0.5).add(0.5)
    spoke.pow(3)

    // Radial falloff from source
    const radialFade = smoothstep(decayNode, float(0), dist)

    const rays = spoke.pow(3).mul(radialFade).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(rays)), prev.w)
  }, order)
</script>
