<script setup lang="ts">
  import { Color } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    axis = 'y',
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    axis?: 'x' | 'y'
    order?: number
  }>()

  const colorAVal = new Color(colorA)
  const colorBVal = new Color(colorB)
  const colorANode = uniform(colorAVal)
  const colorBNode = uniform(colorBVal)
  watch(
    () => colorA,
    (v) => {
      colorANode.value.set(v)
    }
  )
  watch(
    () => colorB,
    (v) => {
      colorBNode.value.set(v)
    }
  )

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((_prev) => {
    const t = axis === 'x' ? uvNode.value.x : uvNode.value.y
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  }, order)
</script>
