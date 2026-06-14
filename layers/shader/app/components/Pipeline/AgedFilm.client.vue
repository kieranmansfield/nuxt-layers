<script setup lang="ts">
  import { clamp, float, floor, time, uniform, vec3, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { grain, vignette } from '../../shaders/common/grain'

  /**
   * Preset: combines grain + warm tone shift + vignette + slight fade.
   * A convenient one-stop aged film look.
   */
  const {
    intensity = 1,
    grainStrength = 0.04,
    vignetteStrength = 0.5,
    warmth = 0.15,
    order = 0,
  } = defineProps<{
    /** Overall intensity: 0 = no effect, 1 = full aged look */
    intensity?: number
    /** Grain strength */
    grainStrength?: number
    /** Vignette darkness */
    vignetteStrength?: number
    /** Warm shadow tint amount */
    warmth?: number
    order?: number
  }>()

  const intensityNode = uniform(intensity)
  const grainNode = uniform(grainStrength)
  const vigNode = uniform(vignetteStrength)
  const warmthNode = uniform(warmth)
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => grainStrength,
    (v) => {
      grainNode.value = v
    }
  )
  watch(
    () => vignetteStrength,
    (v) => {
      vigNode.value = v
    }
  )
  watch(
    () => warmth,
    (v) => {
      warmthNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const t = time

    // Film grain
    const seed = floor(t.mul(24))
    const g = grain(uv, grainNode, seed)

    // Warm shadows: boost R and reduce B in dark areas
    const lum = luminance(prev.xyz)
    const shadowWarm = float(1).sub(lum).mul(warmthNode)
    const warm = prev.xyz.add(vec3(shadowWarm, shadowWarm.mul(0.3), shadowWarm.negate()))

    // Vignette
    const vig = vignette(uv, vigNode, float(0.4))

    // Slight overall fade (film desaturation/lift)
    const faded = warm.mul(float(0.92)).add(float(0.04))

    const result = clamp(faded.mul(vig).add(g), 0, 1)
    return vec4(result.mix(prev.xyz, float(1).sub(intensityNode)), prev.w)
  }, order)
</script>
