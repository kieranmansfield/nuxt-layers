<script setup lang="ts">
  import { uniform, vec3, vec4 } from 'three/tsl'

  /**
   * Arbitrary RGB channel mixing matrix.
   * Each output channel is a weighted sum of all three input channels.
   * Identity: rr=1 gg=1 bb=1, all cross-terms = 0.
   */
  const {
    rRow = [1, 0, 0],
    gRow = [0, 1, 0],
    bRow = [0, 0, 1],
    order = 0,
  } = defineProps<{
    /** R channel: [R contribution, G contribution, B contribution] */
    rRow?: [number, number, number]
    /** G channel: [R contribution, G contribution, B contribution] */
    gRow?: [number, number, number]
    /** B channel: [R contribution, G contribution, B contribution] */
    bRow?: [number, number, number]
    order?: number
  }>()

  const rrNode = uniform(rRow[0])
  const rgNode = uniform(rRow[1])
  const rbNode = uniform(rRow[2])
  const grNode = uniform(gRow[0])
  const ggNode = uniform(gRow[1])
  const gbNode = uniform(gRow[2])
  const brNode = uniform(bRow[0])
  const bgNode = uniform(bRow[1])
  const bbNode = uniform(bRow[2])

  watch(
    () => rRow,
    ([r, g, b]) => {
      rrNode.value = r
      rgNode.value = g
      rbNode.value = b
    }
  )
  watch(
    () => gRow,
    ([r, g, b]) => {
      grNode.value = r
      ggNode.value = g
      gbNode.value = b
    }
  )
  watch(
    () => bRow,
    ([r, g, b]) => {
      brNode.value = r
      bgNode.value = g
      bbNode.value = b
    }
  )

  useShaderStage((prev) => {
    const r = prev.r.mul(rrNode).add(prev.g.mul(rgNode)).add(prev.b.mul(rbNode))
    const g = prev.r.mul(grNode).add(prev.g.mul(ggNode)).add(prev.b.mul(gbNode))
    const b = prev.r.mul(brNode).add(prev.g.mul(bgNode)).add(prev.b.mul(bbNode))
    return vec4(vec3(r, g, b), prev.w)
  }, order)
</script>
