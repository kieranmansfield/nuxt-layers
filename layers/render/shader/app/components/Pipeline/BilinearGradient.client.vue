<script setup lang="ts">
  import { Color } from 'three'
  import { mix, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const blNode = hexToVec3Uniform(bottomLeft)
  const brNode = hexToVec3Uniform(bottomRight)
  const tlNode = hexToVec3Uniform(topLeft)
  const trNode = hexToVec3Uniform(topRight)
  watch(
    () => bottomLeft,
    (v) => {
      const c = new Color(v)
      blNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => bottomRight,
    (v) => {
      const c = new Color(v)
      brNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => topLeft,
    (v) => {
      const c = new Color(v)
      tlNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => topRight,
    (v) => {
      const c = new Color(v)
      trNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const bottom = mix(blNode, brNode, uvCurrent.x)
    const top = mix(tlNode, trNode, uvCurrent.x)
    const colour = mix(bottom, top, uvCurrent.y)
    return vec4(colour, 1.0)
  }, order)
</script>
