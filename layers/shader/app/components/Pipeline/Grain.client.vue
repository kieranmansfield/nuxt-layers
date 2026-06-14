<script setup lang="ts">
  import {
    clamp,
    dot,
    float,
    floor,
    fract,
    mix,
    pow,
    sin,
    step,
    time,
    uniform,
    vec2,
    vec4,
  } from 'three/tsl'

  import { blendOverlay, blendScreen, blendSoftLight } from '../../shaders/common/blend'

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

  const intensityNode = uniform(intensity)
  const opacityNode = uniform(opacity)
  const sizeNode = uniform(size)
  const fpsNode = uniform(fps)
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )
  watch(
    () => size,
    (v) => {
      sizeNode.value = v
    }
  )
  watch(
    () => fps,
    (v) => {
      fpsNode.value = v
    }
  )

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
    let blended
    switch (blendMode) {
      case 'sub':
        blended = prev.xyz.sub(shaped.mul(intensityNode).mul(opacityNode))
        break
      case 'screen':
        blended = mix(prev.xyz, blendScreen(prev.xyz, shaped), mixFactor)
        break
      case 'overlay':
        blended = mix(prev.xyz, blendOverlay(prev.xyz, shaped), mixFactor)
        break
      case 'soft-light':
        blended = mix(prev.xyz, blendSoftLight(prev.xyz, shaped), mixFactor)
        break
      default: // 'add'
        blended = prev.xyz.add(shaped.sub(0.5).mul(intensityNode).mul(opacityNode))
    }
    return clamp(vec4(blended, prev.w), 0, 1)
  }, order)
</script>
