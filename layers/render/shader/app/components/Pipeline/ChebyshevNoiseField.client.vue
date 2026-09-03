<script setup lang="ts">
  import { float, time, uniform, vec4 } from 'three/tsl'

  import { simplexNoise2D } from '../../shaders/common/noise'

  /**
   * Noise-distorted Chebyshev box shape — the genuary22 pattern.
   * Formula: 1 - max(abs(uv.x * scaleX * n), abs(uv.y * scaleY * n2))
   * where n, n2 are two simplex noise octaves at different frequencies.
   * Produces a noise-eroded cross/box silhouette. Outputs a float mask for CosinePalette.
   */
  const {
    scaleX = 2,
    scaleY = 2,
    noiseFreq1 = 1.5,
    noiseFreq2 = 2.3,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    /** Horizontal scale of the box */
    scaleX?: number
    /** Vertical scale of the box */
    scaleY?: number
    /** Noise frequency for the first octave (X distortion) */
    noiseFreq1?: number
    /** Noise frequency for the second octave (Y distortion) */
    noiseFreq2?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const scaleXNode = uniform(scaleX)
  const scaleYNode = uniform(scaleY)
  const freq1Node = uniform(noiseFreq1)
  const freq2Node = uniform(noiseFreq2)
  const speedNode = uniform(speed)
  watch(
    () => scaleX,
    (v) => {
      scaleXNode.value = v
    }
  )
  watch(
    () => scaleY,
    (v) => {
      scaleYNode.value = v
    }
  )
  watch(
    () => noiseFreq1,
    (v) => {
      freq1Node.value = v
    }
  )
  watch(
    () => noiseFreq2,
    (v) => {
      freq2Node.value = v
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
    const uvCurrent = pipeline.uvNode.value
    const centered = uvCurrent.sub(0.5)
    const t = time.mul(speedNode)

    const n = simplexNoise2D(centered.mul(freq1Node).add(t)).mul(0.5).add(0.5)
    const n2 = simplexNoise2D(centered.mul(freq2Node).sub(t.mul(0.7)))
      .mul(0.5)
      .add(0.5)

    const box = float(1)
      .sub(centered.x.mul(scaleXNode).mul(n).abs().max(centered.y.mul(scaleYNode).mul(n2).abs()))
      .max(float(0))

    return vec4(box, box, box, float(1))
  }, order)
</script>
