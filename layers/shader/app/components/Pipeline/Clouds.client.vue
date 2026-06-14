<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, smoothstep, time, uniform, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  const {
    colorSky = '#5588cc',
    colorCloud = '#ffffff',
    scale = 2,
    coverage = 0.5,
    softness = 0.15,
    speed = 0.05,
    order = 0,
  } = defineProps<{
    /** Sky colour */
    colorSky?: string
    /** Cloud colour */
    colorCloud?: string
    /** FBM noise input scale */
    scale?: number
    /** Cloud coverage: lower = fewer clouds, higher = overcast */
    coverage?: number
    /** Cloud softness */
    softness?: number
    /** Wind speed */
    speed?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorSkyNode = toVec3Node(colorSky)
  const colorCloudNode = toVec3Node(colorCloud)
  const scaleNode = uniform(scale)
  const coverageNode = uniform(coverage)
  const softnessNode = uniform(softness)
  const speedNode = uniform(speed)
  watch(
    () => colorSky,
    (v) => {
      const c = new Color(v)
      colorSkyNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorCloud,
    (v) => {
      const c = new Color(v)
      colorCloudNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => coverage,
    (v) => {
      coverageNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
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
    const wind = time.mul(speedNode)
    const n = fbm2D(uv.mul(scaleNode).add(wind)).mul(0.5).add(0.5)
    // Remap to cloud mask using coverage + softness
    const cloud = smoothstep(coverageNode.sub(softnessNode), coverageNode.add(softnessNode), n)
    return vec4(mix(colorSkyNode, colorCloudNode, cloud), float(1))
  }, order)
</script>
