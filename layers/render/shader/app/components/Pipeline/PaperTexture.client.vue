<script setup lang="ts">
  import { floor, time, vec4 } from 'three/tsl'

  import { paperTexture } from '../../shaders/common/grain'

  /**
   * Paper texture overlay — multi-octave grain that reads like coarse paper or canvas.
   * Adds tactile analogue feel to any underlying image.
   */
  const {
    scale = 12,
    intensity = 0.08,
    speed = 0,
    order = 0,
  } = defineProps<{
    /** Texture scale — higher = finer grain pattern */
    scale?: number
    /** Overlay intensity */
    intensity?: number
    /** Animate slowly for a living-paper effect (0 = static) */
    speed?: number
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const intensityNode = useUniformProp(() => intensity)
  const speedNode = useUniformProp(() => speed)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const seed = floor(time.mul(speedNode).mul(6))

    const tex = paperTexture(uv, scaleNode, intensityNode, seed)
    return vec4(prev.xyz.add(tex), prev.w)
  }, order)
</script>
