<script setup lang="ts">
  import { time, vec4 } from 'three/tsl'

  import { crtEffect } from '../../shaders/common/grain'

  const {
    scanlineDensity = 300,
    scanlineIntensity = 0.15,
    vignette = 0.4,
    grain = 0.03,
    order = 0,
  } = defineProps<{
    /** Scanlines across the screen */
    scanlineDensity?: number
    /** Scanline darkness (0-1) */
    scanlineIntensity?: number
    /** Edge darkening (0-1) */
    vignette?: number
    /** Animated grain amount (0-1) */
    grain?: number
    order?: number
  }>()

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const out = crtEffect(prev.xyz, pipeline.uvNode.value, {
      scanlinesDensity: scanlineDensity,
      scanlinesIntensity: scanlineIntensity,
      vignetteIntensity: vignette,
      grainIntensity: grain,
      grainSeed: time,
    })
    return vec4(out, prev.w)
  }, order)
</script>
