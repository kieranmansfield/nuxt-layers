<script setup lang="ts">
  import { mix, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

  const {
    shadowColor = '#1a0033',
    highlightColor = '#ffcc00',
    order = 0,
  } = defineProps<{
    /** Shadow colour (low luminance) */
    shadowColor?: string
    /** Highlight colour (high luminance) */
    highlightColor?: string
    order?: number
  }>()

  const shadowNode = useColorProp(() => shadowColor)
  const highlightNode = useColorProp(() => highlightColor)

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    return vec4(mix(shadowNode, highlightNode, lum), prev.w)
  }, order)
</script>
