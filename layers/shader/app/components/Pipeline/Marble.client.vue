<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, sin, time, uniform, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  const {
    colorA = '#f5f0e8',
    colorB = '#6a5a4a',
    frequency = 5,
    noiseScale = 3,
    noiseStrength = 8,
    sharpness = 4,
    speed = 0,
    order = 0,
  } = defineProps<{
    /** Base (vein background) colour */
    colorA?: string
    /** Vein colour */
    colorB?: string
    /** Marble vein frequency */
    frequency?: number
    /** FBM noise scale for vein turbulence */
    noiseScale?: number
    /** Noise strength applied to sine input */
    noiseStrength?: number
    /** Vein sharpness — higher = thinner veins */
    sharpness?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const freqNode = uniform(frequency)
  const noiseScaleNode = uniform(noiseScale)
  const noiseStrNode = uniform(noiseStrength)
  const sharpNode = uniform(sharpness)
  const speedNode = uniform(speed)
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => noiseScale,
    (v) => {
      noiseScaleNode.value = v
    }
  )
  watch(
    () => noiseStrength,
    (v) => {
      noiseStrNode.value = v
    }
  )
  watch(
    () => sharpness,
    (v) => {
      sharpNode.value = v
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
    const n = fbm2D(uv.mul(noiseScaleNode).add(t))
    // Sine + noise offset creates the vein pattern
    const vein = sin(uv.x.mul(freqNode).add(n.mul(noiseStrNode)))
      .abs()
      .pow(sharpNode)
    return vec4(mix(colorANode, colorBNode, vein), float(1))
  }, order)
</script>
