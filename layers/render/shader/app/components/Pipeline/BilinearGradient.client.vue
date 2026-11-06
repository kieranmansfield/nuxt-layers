<script setup lang="ts">
  import { mix, vec4 } from 'three/tsl'

  const {
    bottomLeft = '#000000',
    bottomRight = '#ff0000',
    topLeft = '#0000ff',
    topRight = '#ffffff',
    order = 0,
  } = defineProps<{
    /** Bottom-left corner colour */
    bottomLeft?: string
    /** Bottom-right corner colour */
    bottomRight?: string
    /** Top-left corner colour */
    topLeft?: string
    /** Top-right corner colour */
    topRight?: string
    order?: number
  }>()

  const blNode = useColorProp(() => bottomLeft)
  const brNode = useColorProp(() => bottomRight)
  const tlNode = useColorProp(() => topLeft)
  const trNode = useColorProp(() => topRight)

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const bottom = mix(blNode, brNode, uvCurrent.x)
    const top = mix(tlNode, trNode, uvCurrent.x)
    const colour = mix(bottom, top, uvCurrent.y)
    return vec4(colour, 1.0)
  }, order)
</script>
