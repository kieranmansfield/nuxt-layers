<script setup lang="ts">
  import { Color } from 'three'
  import { uniform, vec4 } from 'three/tsl'

  const { color = '#ffffff', order = 0 } = defineProps<{
    color?: string
    order?: number
  }>()

  const colorVal = new Color(color)
  const colorNode = uniform(colorVal)
  watch(
    () => color,
    (v) => {
      colorNode.value.set(v)
    }
  )

  useShaderStage((_prev) => vec4(colorNode, 1.0), order)
</script>
