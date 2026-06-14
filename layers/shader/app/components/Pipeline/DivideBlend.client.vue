<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { clamp, float, mix, uniform, vec4 } from 'three/tsl'

  const {
    color = '#808080',
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

  useShaderStage((prev) => {
    const divided = clamp(prev.xyz.div(colorNode.max(float(0.001))), float(0), float(1))
    return vec4(mix(prev.xyz, divided, opacityNode), prev.w)
  }, order)
</script>
