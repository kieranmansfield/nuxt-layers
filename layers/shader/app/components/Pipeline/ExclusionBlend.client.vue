<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { blendExclusion } from '../../shaders/common/blend'

  const {
    color = '#ffffff',
    opacity = 1,
    order = 0,
  } = defineProps<{
    color?: string
    opacity?: number
    order?: number
  }>()

  const colorNode = (() => {
    const c = new Color(color)
    return uniform(new Vector3(c.r, c.g, c.b))
  })()
  const opacityNode = uniform(opacity)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

  useShaderStage(
    (prev) => vec4(mix(prev.xyz, blendExclusion(prev.xyz, colorNode), opacityNode), prev.w),
    order
  )
</script>
