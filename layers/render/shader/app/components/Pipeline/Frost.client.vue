<script setup lang="ts">
  import { convertToTexture, uv, float, floor, Loop, uniform, vec2, vec4 } from 'three/tsl'

  import { hash22 } from '../../shaders/common/noise'

  const {
    amount = 0.02,
    grain = 600,
    samples = 8,
    order = 0,
  } = defineProps<{
    /** Maximum per-pixel scatter distance in UV units */
    amount?: number
    /** Scatter cell density — higher = finer frosted grain */
    grain?: number
    /** Scattered taps averaged per pixel */
    samples?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  const grainNode = uniform(grain)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )
  watch(
    () => grain,
    (v) => {
      grainNode.value = v
    }
  )

  useShaderStage((prev) => {
    const tex = convertToTexture(prev)
    // Sample in plain screen space: the captured texture already includes any UV stages
    const base = uv()
    const cell = floor(base.mul(grainNode))
    const acc = vec4(0).toVar()
    Loop({ start: 0, end: samples, type: 'int' }, ({ i }) => {
      // Fixed random scatter per grain cell → frosted-glass look
      const jitter = hash22(cell.add(vec2(float(i).mul(17.31), float(i).mul(5.77)))).sub(0.5)
      acc.addAssign(tex.sample(base.add(jitter.mul(amountNode))))
    })
    return acc.div(float(samples))
  }, order)
</script>
