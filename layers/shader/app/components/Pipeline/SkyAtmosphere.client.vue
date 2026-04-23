<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, clamp, mix, pow, dot, vec3, vec4, float } from 'three/tsl'

const props = withDefaults(defineProps<{
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
}>(), {
  zenith: '#1a3a8a',
  horizon: '#7ab0d8',
  ground: '#5a4a3a',
  sunDirection: () => [0.3, 0.8, 0.5],
  sunColor: '#fff8e0',
  sunPower: 512,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const zenithNode = toVec3Node(props.zenith)
const horizonNode = toVec3Node(props.horizon)
const groundNode = toVec3Node(props.ground)
const sunColorNode = toVec3Node(props.sunColor)
const sunPowerNode = uniform(props.sunPower)

const sunDir = new Vector3(...props.sunDirection).normalize()
const sunDirNode = uniform(new Vector3(sunDir.x, sunDir.y, sunDir.z))

watch(() => props.zenith, v => { const c = new Color(v); zenithNode.value.set(c.r, c.g, c.b) })
watch(() => props.horizon, v => { const c = new Color(v); horizonNode.value.set(c.r, c.g, c.b) })
watch(() => props.ground, v => { const c = new Color(v); groundNode.value.set(c.r, c.g, c.b) })
watch(() => props.sunColor, v => { const c = new Color(v); sunColorNode.value.set(c.r, c.g, c.b) })
watch(() => props.sunPower, v => { sunPowerNode.value = v })
watch(() => props.sunDirection, ([x, y, z]) => {
  const d = new Vector3(x, y, z).normalize()
  sunDirNode.value.set(d.x, d.y, d.z)
})

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const ray = pipeline.rayNode.value

    // Sky gradient: -1..+1 on Y → ground..zenith
    const t = clamp(ray.y.mul(2.0).add(0.5), 0, 1)
    const sky = mix(horizonNode, zenithNode, t)
    const colour = mix(groundNode, sky, clamp(ray.y.add(0.1).mul(10.0), 0, 1))

    // Sun disc
    const sunDot = dot(ray, sunDirNode).max(float(0))
    const sun = sunColorNode.mul(pow(sunDot, sunPowerNode))

    return vec4(colour.add(sun), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>
