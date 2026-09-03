<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { clamp, dot, float, mix, pow, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    zenith = '#1a3a8a',
    horizon = '#7ab0d8',
    ground = '#5a4a3a',
    sunDirection = [0.3, 0.8, 0.5],
    sunColor = '#fff8e0',
    sunPower = 512,
    order = 0,
  } = defineProps<{
    /** Sky colour at the zenith */
    zenith?: string
    /** Sky colour at the horizon */
    horizon?: string
    /** Ground colour below horizon */
    ground?: string
    /** Sun direction — [x, y, z] world space (will be normalised) */
    sunDirection?: [number, number, number]
    /** Sun colour */
    sunColor?: string
    /** Sun disk sharpness (higher = smaller disk) */
    sunPower?: number
    order?: number
  }>()

  const zenithNode = hexToVec3Uniform(zenith)
  const horizonNode = hexToVec3Uniform(horizon)
  const groundNode = hexToVec3Uniform(ground)
  const sunColorNode = hexToVec3Uniform(sunColor)
  const sunPowerNode = uniform(sunPower)

  const sunDir = new Vector3(...sunDirection).normalize()
  const sunDirNode = uniform(new Vector3(sunDir.x, sunDir.y, sunDir.z))

  watch(
    () => zenith,
    (v) => {
      const c = new Color(v)
      zenithNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => horizon,
    (v) => {
      const c = new Color(v)
      horizonNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => ground,
    (v) => {
      const c = new Color(v)
      groundNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => sunColor,
    (v) => {
      const c = new Color(v)
      sunColorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => sunPower,
    (v) => {
      sunPowerNode.value = v
    }
  )
  watch(
    () => sunDirection,
    ([x, y, z]) => {
      const d = new Vector3(x, y, z).normalize()
      sunDirNode.value.set(d.x, d.y, d.z)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const ray = pipeline.rayNode.value

    // Sky gradient: -1..+1 on Y → ground..zenith
    const t = clamp(ray.y.mul(2.0).add(0.5), 0, 1)
    const sky = mix(horizonNode, zenithNode, t)
    const colour = mix(groundNode, sky, clamp(ray.y.add(0.1).mul(10.0), 0, 1))

    // Sun disc
    const sunDot = dot(ray, sunDirNode).max(float(0))
    const sun = sunColorNode.mul(pow(sunDot, sunPowerNode))

    return vec4(colour.add(sun), 1.0)
  }, order)
</script>
