<script setup lang="ts">
  import { blendSoftLight } from '../../shaders/common/blend'

  const {
    color = '#808080',
    opacity = 1,
    order = 0,
  } = defineProps<{
    color?: string
    opacity?: number
    order?: number
  }>()

  useShaderMixBlend(
    blendSoftLight,
    () => color,
    () => opacity,
    order
  )
</script>
