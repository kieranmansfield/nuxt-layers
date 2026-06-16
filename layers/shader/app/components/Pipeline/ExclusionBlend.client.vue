<script setup lang="ts">
  import { blendExclusion } from '../../shaders/common/blend'

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
    blendExclusion,
    () => color,
    () => opacity,
    order
  )
</script>
