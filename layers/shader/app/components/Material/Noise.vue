<script setup lang="ts">
import { Color, DoubleSide } from 'three'
import { mix, time as tslTime, uniform, uv, vec3 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { fbm, simplexNoise2D } from '../../utils/tsl/noise'

const props = withDefaults(
  defineProps<{
    scale?: number
    speed?: number
    octaves?: number
    baseColor?: string
    peakColor?: string
    type?: 'simplex' | 'fbm'
    transparent?: boolean
    /** Mouse X position (0-1) for interaction */
    mouseX?: number
    /** Mouse Y position (0-1) for interaction */
    mouseY?: number
    /** Enable mouse interaction */
    mouseInteraction?: boolean
    /** Mouse interaction strength */
    mouseStrength?: number
  }>(),
  {
    scale: 3,
    speed: 0.5,
    octaves: 4,
    baseColor: '#1e1b4b',
    peakColor: '#c084fc',
    type: 'simplex',
    transparent: false,
    mouseX: 0.5,
    mouseY: 0.5,
    mouseInteraction: false,
    mouseStrength: 0.5,
  }
)

// Create reactive uniforms
const scaleUniform = uniform(props.scale)
const speedUniform = uniform(props.speed)
const mouseXUniform = uniform(props.mouseX)
const mouseYUniform = uniform(props.mouseY)
const mouseStrengthUniform = uniform(props.mouseStrength)
const baseColorUniform = uniform(new Color(props.baseColor))
const peakColorUniform = uniform(new Color(props.peakColor))

// Watch prop changes
watch(
  () => props.scale,
  (val) => {
    scaleUniform.value = val
  }
)
watch(
  () => props.speed,
  (val) => {
    speedUniform.value = val
  }
)
watch(
  () => props.mouseX,
  (val) => {
    mouseXUniform.value = val
  }
)
watch(
  () => props.mouseY,
  (val) => {
    mouseYUniform.value = val
  }
)
watch(
  () => props.mouseStrength,
  (val) => {
    mouseStrengthUniform.value = val
  }
)
watch(
  () => props.baseColor,
  (val) => {
    baseColorUniform.value = new Color(val)
  }
)
watch(
  () => props.peakColor,
  (val) => {
    peakColorUniform.value = new Color(val)
  }
)

const material = computed(() => {
  const mat = new MeshBasicNodeMaterial()

  // Animated UV with reactive uniforms
  let animatedUV = uv().mul(scaleUniform).add(tslTime.mul(speedUniform))

  // Add mouse interaction
  if (props.mouseInteraction) {
    const mouseOffset = vec3(
      mouseXUniform.sub(0.5).mul(mouseStrengthUniform),
      mouseYUniform.sub(0.5).mul(mouseStrengthUniform),
      0
    )
    animatedUV = animatedUV.add(mouseOffset.xy)
  }

  // Generate noise based on type
  let noiseValue
  if (props.type === 'fbm') {
    noiseValue = fbm(vec3(animatedUV.x, animatedUV.y, tslTime.mul(speedUniform.mul(0.1))), {
      octaves: props.octaves,
      lacunarity: 2.0,
      gain: 0.5,
      amplitude: 0.5,
      frequency: 1.0,
    })
  } else {
    noiseValue = simplexNoise2D(animatedUV)
  }

  // Remap noise from [-1, 1] to [0, 1]
  const normalizedNoise = noiseValue.mul(0.5).add(0.5)

  // Mix colors based on noise using reactive uniforms
  const colorNode = mix(vec3(baseColorUniform), vec3(peakColorUniform), normalizedNoise)

  mat.colorNode = colorNode as any
  mat.transparent = props.transparent
  mat.side = DoubleSide

  return mat
})

defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>
