<script setup lang="ts">
  import { clamp, mix, smoothstep, uniform, vec3, vec4 } from 'three/tsl'
  import { luminance } from '../../shaders/common/blend'

  const {
    contrast = 1,
    order = 0,
  } = defineProps<{
    /** Contrast of the luminance before mapping */
    contrast?: number
    order?: number
  }>()

  const contrastNode = uniform(contrast)
  watch(
    () => contrast,
    (v) => {
      contrastNode.value = v
    }
  )

  useShaderStage((prev) => {
    const l = clamp(luminance(prev.xyz).sub(0.5).mul(contrastNode).add(0.5), 0, 1)
    const c = mix(vec3(0, 0, 0.6), vec3(0, 0.9, 0.9), smoothstep(0, 0.25, l))
    const c2 = mix(c, vec3(0.1, 0.9, 0.1), smoothstep(0.25, 0.5, l))
    const c3 = mix(c2, vec3(1, 0.9, 0), smoothstep(0.5, 0.75, l))
    return vec4(mix(c3, vec3(1, 0.1, 0), smoothstep(0.75, 1, l)), prev.w)
  }, order)
</script>
