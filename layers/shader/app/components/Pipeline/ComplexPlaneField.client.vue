<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2, vec4, float, cos, sin } from 'three/tsl'
import { complexDiv, complexLog } from '../../shaders/common/complex'

/**
 * Complex number plane visualisation — the imaginary2 pattern.
 * Places two poles p, q derived from poleAngle/poleDistance,
 * computes the Möbius transformation (z-p)/(z-q), takes the complex log,
 * and extracts the imaginary component (winding angle) as a scalar float.
 * Outputs grayscale for CosinePalette (scalarSource: 'prev').
 */
const props = withDefaults(defineProps<{
  /** Angle between the two poles in radians */
  poleAngle?: number
  /** Distance of poles from origin */
  poleDistance?: number
  /** Weight of the imaginary (winding) component */
  imaginaryWeight?: number
  /** Weight of the radial (exp) component */
  radialWeight?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), {
  poleAngle: Math.PI / 3,
  poleDistance: 0.4,
  imaginaryWeight: 0.6,
  radialWeight: 0.4,
  speed: 0.05,
  order: 0,
})

const poleAngleNode = uniform(props.poleAngle)
const poleDistNode = uniform(props.poleDistance)
const imagWeightNode = uniform(props.imaginaryWeight)
const radWeightNode = uniform(props.radialWeight)
const speedNode = uniform(props.speed)
watch(() => props.poleAngle, v => { poleAngleNode.value = v })
watch(() => props.poleDistance, v => { poleDistNode.value = v })
watch(() => props.imaginaryWeight, v => { imagWeightNode.value = v })
watch(() => props.radialWeight, v => { radWeightNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode)

    // UV centred
    const z = uvCurrent.sub(0.5)

    // Pole position (complex number)
    const angle = poleAngleNode.add(t)
    const p = vec2(cos(angle).mul(poleDistNode), sin(angle).mul(poleDistNode))
    const q = vec2(p.x, p.y.negate())   // conjugate

    // Möbius: (z - p) / (z - q)
    const w = complexDiv(z.sub(p), z.sub(q))

    // Complex log: (ln|w|, arg(w))
    const logW = complexLog(w)

    // Combine imaginary (winding angle) and radial (exp magnitude) components
    const imagPart = logW.y.mul(imagWeightNode)
    const radPart = z.x.exp().div(z.y.abs().add(float(0.001))).mul(radWeightNode)
    const scalar = imagPart.add(radPart).mul(0.5).add(0.5)

    return vec4(scalar, scalar, scalar, float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>
