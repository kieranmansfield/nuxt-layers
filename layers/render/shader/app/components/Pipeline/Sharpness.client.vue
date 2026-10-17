<script setup lang="ts">
  import { convertToTexture, uniform, uv, vec2, vec4 } from 'three/tsl'

  const {
    amount = 1,
    radius = 0.002,
    order = 0,
  } = defineProps<{
    /** Sharpening strength */
    amount?: number
    /** Tap offset in UV units */
    radius?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const radiusNode = uniform(radius)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => radius,
    (v) => {
      radiusNode.value = v
    }
  )

  useShaderStage((prev) => {
    const tex = convertToTexture(prev)
    const base = uv()
    const o = radiusNode
    const sum = tex
      .sample(base.add(vec2(o, 0)))
      .add(tex.sample(base.sub(vec2(o, 0))))
      .add(tex.sample(base.add(vec2(0, o))))
      .add(tex.sample(base.sub(vec2(0, o))))
    const center = tex.sample(base)
    // Unsharp mask: centre + (centre - neighbour average) * amount
    const sharp = center.xyz.add(center.xyz.sub(sum.xyz.mul(0.25)).mul(amountNode))
    return vec4(sharp, prev.w)
  }, order)
</script>
