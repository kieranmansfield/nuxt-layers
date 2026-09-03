<script setup lang="ts">
  import { blendScreen } from '../../shaders/common/blend'

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
    blendScreen,
    () => color,
    () => opacity,
    order
  )
</script>
