<script setup lang="ts">
  import { Loop, convertToTexture, cos, float, sin, uniform, uv, vec2, vec4 } from 'three/tsl'

  const {
    amount = 0.03,
    angle = 0,
    order = 0,
  } = defineProps<{
    /** Blur length (UV) */
    amount?: number
    /** Blur direction in radians */
    angle?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const angleNode = uniform(angle)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => angle,
    (v) => {
      angleNode.value = v
    }
  )

  useShaderStage((prev) => {
    const tex = convertToTexture(prev)
    const base = uv()
    const dir = vec2(cos(angleNode), sin(angleNode))
    const acc = vec4(0).toVar()
    Loop({ start: 0, end: 16, type: 'int' }, ({ i }) => {
      const t = float(i).div(15).sub(0.5)
      acc.addAssign(tex.sample(base.add(dir.mul(t).mul(amountNode))))
    })
    return acc.div(16)
  }, order)
</script>
