<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  const { color = '#ffffff', order = 0 } = defineProps<{
    color?: string
    order?: number
  }>()

  const colorNode = useColorProp(() => color)

  useShaderStage((_prev) => vec4(colorNode, 1.0), order)
</script>
