<script setup lang="ts">
  import { convertToTexture, uv, dot, uniform, vec2, vec3, vec4 } from 'three/tsl'

  const {
    strength = 1,
    distance = 0.003,
    order = 0,
  } = defineProps<{
    /** Relief strength */
    strength?: number
    /** Sample offset in UV units */
    distance?: number
    order?: number
  }>()

  const strengthNode = uniform(strength)
  const distanceNode = uniform(distance)
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )
  watch(
    () => distance,
    (v) => {
      distanceNode.value = v
    }
  )

  useShaderStage((prev) => {
    const tex = convertToTexture(prev)
    // Sample in plain screen space: the captured texture already includes any UV stages
    const base = uv()
    const o = vec2(distanceNode, distanceNode)
    const lumaW = vec3(0.2126, 0.7152, 0.0722)
    // Diagonal difference of luminance, lit from the top-left
    const a = dot(tex.sample(base.sub(o)).xyz, lumaW)
    const b = dot(tex.sample(base.add(o)).xyz, lumaW)
    const relief = a.sub(b).mul(strengthNode).add(0.5)
    return vec4(vec3(relief), prev.w)
  }, order)
</script>
