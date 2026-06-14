<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { uniform, vec4 } from 'three/tsl'

  const {
    color = '#ff8844',
    opacity = 1,
    order = 0,
  } = defineProps<{
    /** Tint colour — multiplied against the existing colour */
    color?: string
    /** Blend between original (0) and fully tinted (1) */
    opacity?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorNode = toVec3Node(color)
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
    const tinted = prev.xyz.mul(colorNode)
    return vec4(prev.xyz.mix(tinted, opacityNode), prev.w)
  }, order)
</script>
