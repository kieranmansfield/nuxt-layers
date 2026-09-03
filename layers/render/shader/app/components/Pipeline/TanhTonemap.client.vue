<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import { tanhTonemap } from '../../shaders/common/tonemapping'

  const { exposure = 1.0, order = 0 } = defineProps<{
    /** Controls how aggressively values above 1 are compressed. dawn5 uses 2.5. */
    exposure?: number
    order?: number
  }>()

  const exposureNode = uniform(exposure)
  watch(
    () => exposure,
    (v) => {
      exposureNode.value = v
    }
  )

  useShaderStage((prev) => vec4(tanhTonemap(prev.xyz.mul(exposureNode)), prev.w), order)
</script>
