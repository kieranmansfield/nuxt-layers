<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, sin, time, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorDeep = '#003366',
    colorShallow = '#66ccff',
    frequency = 8,
    amplitude = 0.5,
    speed = 1,
    order = 0,
  } = defineProps<{
    /** Deep water colour */
    colorDeep?: string
    /** Shallow/crest colour */
    colorShallow?: string
    /** Wave frequency */
    frequency?: number
    /** Wave height */
    amplitude?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const colorDeepNode = hexToVec3Uniform(colorDeep)
  const colorShallowNode = hexToVec3Uniform(colorShallow)
  const freqNode = uniform(frequency)
  const ampNode = uniform(amplitude)
  const speedNode = uniform(speed)
  watch(
    () => colorDeep,
    (v) => {
      const c = new Color(v)
      colorDeepNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorShallow,
    (v) => {
      const c = new Color(v)
      colorShallowNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => amplitude,
    (v) => {
      ampNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)
    // Layered sine waves at different frequencies and phases
    const w1 = sin(uv.x.mul(freqNode).add(t))
    const w2 = sin(
      uv.x
        .mul(freqNode.mul(0.7))
        .add(uv.y.mul(freqNode.mul(0.5)))
        .add(t.mul(0.8))
    )
    const w3 = sin(uv.y.mul(freqNode.mul(1.3)).add(t.mul(1.1)))
    const wave = w1.add(w2).add(w3).div(3).mul(ampNode).mul(0.5).add(0.5)
    return vec4(mix(colorDeepNode, colorShallowNode, wave), float(1))
  }, order)
</script>
