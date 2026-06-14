<script setup lang="ts">
  import { Color } from 'three'
  import { clamp, uniform, vec4 } from 'three/tsl'

  import { blendSubtract } from '../../shaders/common/blend'
  import type { TSLNode } from '../../shaders/types'

  const {
    color = '#808080',
    opacity = 1,
    order = 0,
  } = defineProps<{
    color?: string
    opacity?: number
    order?: number
  }>()

  const colorNode: TSLNode = uniform(new Color(color))
  const opacityNode = uniform(opacity)
  watch(
    () => color,
    (v) => {
      colorNode.value.set(v)
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

  useShaderStage(
    (prev) => clamp(vec4(blendSubtract(prev.xyz, colorNode, opacityNode), prev.w), 0, 1),
    order
  )
</script>
