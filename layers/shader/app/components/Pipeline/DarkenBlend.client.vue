<script setup lang="ts">
  import { blendDarken } from '../../shaders/common/blend'

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
    blendDarken,
    () => color,
    () => opacity,
    order
  )
</script>
