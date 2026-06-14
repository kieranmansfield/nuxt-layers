<script setup lang="ts">
  import { Color } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { blendScreen } from '../../shaders/common/blend'
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
    (prev) => vec4(mix(prev.xyz, blendScreen(prev.xyz, colorNode), opacityNode), prev.w),
    order
  )
</script>
