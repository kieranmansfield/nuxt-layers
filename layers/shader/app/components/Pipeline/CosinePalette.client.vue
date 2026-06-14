<script setup lang="ts">
  import { Vector3 } from 'three'
  import { time, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { cosinePalette } from '../../shaders/common/palette'

  /**
   * IQ's cosine palette — the backbone of phobon/aurora-style shaders.
   * Formula: a + b * cos(2π * (c*t + d))
   * Scalar input t comes from uvNode via scalarSource.
   */
  const {
    a = [0.5, 0.5, 0.5],
    b = [0.5, 0.5, 0.5],
    c = [1.0, 1.0, 1.0],
    d = [0.0, 0.33, 0.67],
    timeScale = 0.1,
    scalarSource = 'uv.y',
    order = 0,
  } = defineProps<{
    /** Colour offset (brightness centre) */
    a?: [number, number, number]
    /** Colour amplitude (contrast) */
    b?: [number, number, number]
    /** Frequency per channel */
    c?: [number, number, number]
    /** Phase offset per channel (colour shift) */
    d?: [number, number, number]
    /** How fast the palette cycles over time */
    timeScale?: number
    /**
     * What value to feed as the scalar input `t`.
     * `'prev'` reads luminance of the previous pipeline stage — use after RingField,
     * ChebyshevNoiseField, or any block that outputs a grayscale scalar as its colour.
     */
    scalarSource?: 'uv.y' | 'uv.x' | 'length' | 'time' | 'prev'
    order?: number
  }>()

  const aNode = uniform(new Vector3(...a))
  const bNode = uniform(new Vector3(...b))
  const cNode = uniform(new Vector3(...c))
  const dNode = uniform(new Vector3(...d))
  const timeScaleNode = uniform(timeScale)

  watch(
    () => a,
    (v) => {
      aNode.value.set(...v)
    }
  )
  watch(
    () => b,
    (v) => {
      bNode.value.set(...v)
    }
  )
  watch(
    () => c,
    (v) => {
      cNode.value.set(...v)
    }
  )
  watch(
    () => d,
    (v) => {
      dNode.value.set(...v)
    }
  )
  watch(
    () => timeScale,
    (v) => {
      timeScaleNode.value = v
    }
  )

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((prev) => {
    let scalar
    if (scalarSource === 'uv.x') scalar = uvNode.value.x
    else if (scalarSource === 'length') scalar = uvNode.value.sub(0.5).length()
    else if (scalarSource === 'time') scalar = time
    else if (scalarSource === 'prev') scalar = luminance(prev.xyz)
    else scalar = uvNode.value.y

    const t = scalar.add(time.mul(timeScaleNode))
    return vec4(cosinePalette(t, aNode, bNode, cNode, dNode), 1.0)
  }, order)
</script>
