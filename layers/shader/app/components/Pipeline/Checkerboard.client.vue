<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { Color, Vector3 } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { checker } from '../../shaders/common/shapes'

  const props = withDefaults(
    defineProps<{
      /** First checker colour */
      colorA?: string
      /** Second checker colour */
      colorB?: string
      /** Number of checker tiles across each axis */
      scale?: number
      order?: number
    }>(),
    { colorA: '#ffffff', colorB: '#000000', scale: 10, order: 0 }
  )

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(props.colorA)
  const colorBNode = toVec3Node(props.colorB)
  const scaleNode = uniform(props.scale)
  watch(
    () => props.colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => props.colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => props.scale,
    (v) => {
      scaleNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const t = checker(uvCurrent, scaleNode)
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  }, props.order)
</script>
