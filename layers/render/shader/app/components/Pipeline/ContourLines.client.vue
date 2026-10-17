<script setup lang="ts">
  import { abs, float, fract, mix, smoothstep, uniform, vec3, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

  const {
    levels = 10,
    thickness = 0.08,
    opacity = 1,
    order = 0,
  } = defineProps<{
    /** Number of contour levels across the luminance range */
    levels?: number
    /** Line thickness as a fraction of one level */
    thickness?: number
    /** Line opacity (0-1) */
    opacity?: number
    order?: number
  }>()

  const levelsNode = uniform(levels)
  const thicknessNode = uniform(thickness)
  const opacityNode = uniform(opacity)
  watch(
    () => levels,
    (v) => {
      levelsNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thicknessNode.value = v
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz).mul(levelsNode)
    // Distance to the nearest integer level, in level units
    const d = abs(fract(lum.add(0.5)).sub(0.5))
    const line = float(1).sub(smoothstep(thicknessNode.mul(0.5), thicknessNode, d))
    return vec4(mix(prev.xyz, vec3(0, 0, 0), line.mul(opacityNode)), prev.w)
  }, order)
</script>
