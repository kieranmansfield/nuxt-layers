<script setup lang="ts">
  import { time, uniform, vec4 } from 'three/tsl'

  import { scanlines } from '../../shaders/common/grain'

  const {
    density = 400,
    intensity = 0.25,
    scrollSpeed = 0,
    order = 0,
  } = defineProps<{
    /** Number of scanlines across the screen */
    density?: number
    /** Darkness of the lines: 0 = invisible, 1 = full black */
    intensity?: number
    /** Animate the lines — speed in lines/second */
    scrollSpeed?: number
    order?: number
  }>()

  const densityNode = uniform(density)
  const intensityNode = uniform(intensity)
  const scrollSpeedNode = uniform(scrollSpeed)
  watch(
    () => density,
    (v) => {
      densityNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )
  watch(
    () => scrollSpeed,
    (v) => {
      scrollSpeedNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const offset = time.mul(scrollSpeedNode)
    const factor = scanlines(uvCurrent, densityNode, intensityNode, offset)
    return vec4(prev.xyz.mul(factor), prev.w)
  }, order)
</script>
