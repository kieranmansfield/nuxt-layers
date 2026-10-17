<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import { ditherColor } from '../../shaders/common/grain'

  const {
    levels = 8,
    strength = 1,
    order = 0,
  } = defineProps<{
    /** Colour levels per channel — lower = more posterised */
    levels?: number
    /** Dither pattern strength */
    strength?: number
    order?: number
  }>()

  const levelsNode = uniform(levels)
  const strengthNode = uniform(strength)
  watch(
    () => levels,
    (v) => {
      levelsNode.value = v
    }
  )
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const out = ditherColor(prev.xyz, pipeline.uvNode.value, levelsNode, strengthNode)
    return vec4(out, prev.w)
  }, order)
</script>
