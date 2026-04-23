<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { Fn, uniform, time, Loop, If, Break, vec3, vec4, float, clamp, mix, sin, cos, abs } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Tunnel inner radius */
  radius?: number
  /** How fast the camera flies forward */
  speed?: number
  /** Wall colour A */
  colorA?: string
  /** Wall colour B */
  colorB?: string
  /** Number of march steps (fixed at shader compile) */
  steps?: number
  order?: number
}>(), {
  radius: 0.8,
  speed: 1,
  colorA: '#1a0a3a',
  colorB: '#ff4488',
  steps: 64,
  order: 0,
})

const radiusNode = uniform(props.radius)
const speedNode = uniform(props.speed)

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}
const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)

watch(() => props.radius, v => { radiusNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })

const pipeline = useShaderPipelineContext()

// Fn defined once at setup — Loop/If/Break/toVar/addAssign require a Fn() stack at compile time
const raymarchFn = Fn(([ray]) => {
  // Camera flies forward along Z
  const camZ = time.mul(speedNode)
  const ro = vec3(float(0), float(0), camZ)
  const rd = ray.normalize()

  const t = float(0).toVar()
  const colour = vec3(0, 0, 0).toVar()
  const hit = float(0).toVar()

  Loop(props.steps, () => {
    const p = ro.add(rd.mul(t))

    // Tunnel SDF: cylinder with twisted walls
    const twist = sin(p.z.mul(0.3).add(camZ.mul(0.1))).mul(0.15)
    const d = p.xy.add(vec3(twist, twist, float(0)).xy).length().sub(radiusNode)

    If(d.lessThan(float(0.001)), () => {
      // Pattern on wall: mix colours by angle around tunnel
      const angle = p.y.atan(p.x).mul(0.5).add(0.5)
      const stripe = sin(p.z.mul(4.0).add(time)).mul(0.5).add(0.5)
      const band = mix(colorANode, colorBNode, clamp(angle.add(stripe.mul(0.3)), 0, 1))
      colour.assign(band)
      hit.assign(float(1))
      Break()
    })

    t.addAssign(abs(d).max(float(0.01)))

    If(t.greaterThan(float(20.0)), () => { Break() })
  })

  // Fog out the far end of the tunnel
  const fog = clamp(float(1).sub(t.div(20.0)), 0, 1)
  const finalColour = colour.mul(fog).mul(hit)

  return vec4(finalColour, hit)
})

useShaderStage(
  () => raymarchFn([pipeline.rayNode.value]),
  props.order,
)
</script>

<template><!-- --></template>
