<script setup lang="ts">
  import { float, mix, smoothstep, time, vec4 } from 'three/tsl'

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

  const colorSkyNode = useColorProp(() => colorSky)
  const colorCloudNode = useColorProp(() => colorCloud)
  const scaleNode = useUniformProp(() => scale)
  const coverageNode = useUniformProp(() => coverage)
  const softnessNode = useUniformProp(() => softness)
  const speedNode = useUniformProp(() => speed)

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
