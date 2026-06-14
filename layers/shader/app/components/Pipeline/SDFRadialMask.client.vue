<script setup lang="ts">
  import { float, uniform, vec4 } from 'three/tsl'

  const {
    scale = 1.5,
    softness = 0.2,
    order = 0,
  } = defineProps<{
    /** Scale factor for the radial distance — larger = tighter mask */
    scale?: number
    /** Softness of the mask edge */
    softness?: number
    order?: number
  }>()

  const scaleNode = uniform(scale)
  const softnessNode = uniform(softness)
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const dist = uvCurrent.sub(0.5).mul(scaleNode).length()
    const mask = float(1).sub(dist).sub(softnessNode).max(0).div(float(1).sub(softnessNode))
    return vec4(prev.xyz, prev.w.mul(mask))
  }, order)
</script>
