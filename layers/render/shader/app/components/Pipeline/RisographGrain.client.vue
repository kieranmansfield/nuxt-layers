<script setup lang="ts">
  import { clamp, floor, time, vec3, vec4 } from 'three/tsl'

  import { blendGrain } from '../../shaders/common/blend'
  import { grain } from '../../shaders/common/grain'

  type GrainBlendMode = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'

  const {
    scale = 0.6,
    strength = 0.12,
    opacity = 1.0,
    misregistration = 0.003,
    fps = 8,
    blendMode = 'add',
    order = 0,
  } = defineProps<{
    scale?: number
    strength?: number
    opacity?: number
    misregistration?: number
    fps?: number
    blendMode?: GrainBlendMode
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const strengthNode = useUniformProp(() => strength)
  const opacityNode = useUniformProp(() => opacity)
  const misregNode = useUniformProp(() => misregistration)
  const fpsNode = useUniformProp(() => fps)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const seed = floor(time.mul(fpsNode))

    const uvR = uv.mul(scaleNode).add(misregNode)
    const uvG = uv.mul(scaleNode)
    const uvB = uv.mul(scaleNode).sub(misregNode)

    // grain() returns (raw - 0.5) * strength → centred around 0
    const rNoise = grain(uvR, strengthNode, seed)
    const gNoise = grain(uvG, strengthNode, seed.add(17.0))
    const bNoise = grain(uvB, strengthNode, seed.add(31.0))
    const grainVec = vec3(rNoise, gNoise, bNoise)

    // Lift centred delta back to [0,1] per-channel texture for blend modes
    const rawVec = grainVec.div(strengthNode).add(0.5)

    const mixFactor = strengthNode.mul(opacityNode)
    const blended = blendGrain(blendMode, prev.xyz, rawVec, mixFactor, () =>
      blendMode === 'sub'
        ? prev.xyz.sub(grainVec.abs().mul(opacityNode))
        : prev.xyz.add(grainVec.mul(opacityNode))
    )
    return vec4(clamp(blended, 0, 1), prev.w)
  }, order)
</script>
