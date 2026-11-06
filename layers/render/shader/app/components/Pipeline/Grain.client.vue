<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { clamp, dot, float, floor, fract, pow, sin, step, time, vec2, vec4 } from 'three/tsl'

  import { blendGrain } from '../../shaders/common/blend'

  type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'
  type GrainStyle = 'smooth' | 'dotted' | 'coarse'

  const {
    intensity = 0.08,
    opacity = 1.0,
    size = 1.0,
    style = 'smooth',
    animated = true,
    fps = 24,
    blendMode = 'add',
    order = 0,
  } = defineProps<{
    intensity?: number
    opacity?: number
    /** UV scale — higher = finer grain, lower = bigger dots */
    size?: number
    /** smooth = continuous noise, dotted = binary on/off specks, coarse = concentrated bright grit */
    style?: GrainStyle
    animated?: boolean
    fps?: number
    blendMode?: GrainBlendMode
    order?: number
  }>()

  const intensityNode = useUniformProp(() => intensity)
  const opacityNode = useUniformProp(() => opacity)
  const sizeNode = useUniformProp(() => size)
  const fpsNode = useUniformProp(() => fps)

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvScaled = uvNode.value.mul(sizeNode)
    const seed = animated ? floor(time.mul(fpsNode)) : float(0)

    // Raw [0,1] hash noise
    const raw = fract(sin(dot(uvScaled.add(seed), vec2(12.9898, 78.233))).mul(43758.5453))

    // Shape the noise based on style
    const shaped =
      style === 'dotted'
        ? step(float(0.65), raw) // binary: sparse bright specks
        : style === 'coarse'
          ? pow(raw, float(4.0)).mul(2.5) // concentrated bright grit, rest dark
          : raw // smooth: continuous noise

    const mixFactor = intensityNode.mul(opacityNode)
    const blended = blendGrain(blendMode, prev.xyz, shaped, mixFactor, () =>
      blendMode === 'sub'
        ? prev.xyz.sub(shaped.mul(intensityNode).mul(opacityNode))
        : prev.xyz.add(shaped.sub(0.5).mul(intensityNode).mul(opacityNode))
    )
    return clamp(vec4(blended, prev.w), 0, 1)
  }, order)
</script>
