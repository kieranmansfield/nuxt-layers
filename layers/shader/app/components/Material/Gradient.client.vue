<script setup lang="ts">
import { Color, DoubleSide } from 'three'
import { mix, sin, time as tslTime, uniform, uv, vec3 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import type { UniformNode } from 'three/webgpu'
import type { TSLNode } from '../../types'

const props = withDefaults(
  defineProps<{
    colors?: string[]
    angle?: number
    type?: 'linear' | 'radial'
    animated?: boolean
    speed?: number
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
    colors: () => ['#4f46e5', '#7c3aed', '#ec4899'],
    angle: 0,
    type: 'linear',
    animated: false,
    speed: 1,
    transparent: false,
    mouseX: 0.5,
    mouseY: 0.5,
    mouseInteraction: false,
    mouseStrength: 0.3,
  }
)

// Create reactive uniforms for all animatable properties
const angleUniform = uniform(props.angle)
const speedUniform = uniform(props.speed)
const mouseXUniform = uniform(props.mouseX)
const mouseYUniform = uniform(props.mouseY)
const mouseStrengthUniform = uniform(props.mouseStrength)

// Create color uniforms (up to 5 colors supported) - stored as typed array
const colorUniforms: UniformNode<Color>[] = [
  uniform(new Color(props.colors[0] || '#4f46e5')),
  uniform(new Color(props.colors[1] || '#7c3aed')),
  uniform(new Color(props.colors[2] || '#ec4899')),
  uniform(new Color(props.colors[3] || '#ec4899')),
  uniform(new Color(props.colors[4] || '#ec4899')),
]

// Watch prop changes and update uniforms
watch(
  () => props.angle,
  (val) => {
    angleUniform.value = val
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
  () => props.colors,
  (colors) => {
    colors.forEach((c, i) => {
      if (i < colorUniforms.length) {
        colorUniforms[i]!.value = new Color(c)
      }
    })
  },
  { deep: true }
)

const material = computed(() => {
  const mat = new MeshBasicNodeMaterial()
  const colorCount = props.colors.length

  // Get UV coordinates
  let t: TSLNode = uv().y

  // Apply angle rotation for linear gradient (using uniform for reactivity)
  if (props.type === 'linear') {
    const rad = angleUniform.mul(Math.PI / 180)
    const cosVal = rad.cos()
    const sinVal = rad.sin()
    t = uv().x.mul(sinVal).add(uv().y.mul(cosVal))
  }

  // Radial gradient uses distance from center
  if (props.type === 'radial') {
    let center = uv().sub(0.5)
    // Add mouse interaction offset
    if (props.mouseInteraction) {
      const mouseOffset = vec3(
        mouseXUniform.sub(0.5).mul(mouseStrengthUniform),
        mouseYUniform.sub(0.5).mul(mouseStrengthUniform),
        0
      )
      center = center.sub(mouseOffset.xy)
    }
    t = center.length().mul(2)
  }

  // Add mouse interaction for linear gradients
  if (props.type === 'linear' && props.mouseInteraction) {
    t = t.add(mouseXUniform.sub(0.5).mul(mouseStrengthUniform))
  }

  // Add animation
  if (props.animated) {
    t = t.add(sin(tslTime.mul(speedUniform)).mul(0.2))
  }

  // Build gradient from colors using uniforms
  // Use type assertion since we know the array is initialized
  const c0 = colorUniforms[0] as UniformNode<Color>
  const c1 = colorUniforms[1] as UniformNode<Color>
  const c2 = colorUniforms[2] as UniformNode<Color>
  const c3 = colorUniforms[3] as UniformNode<Color>
  const c4 = colorUniforms[4] as UniformNode<Color>

  let colorNode: TSLNode = vec3(c0 as unknown as TSLNode)

  if (colorCount === 2) {
    colorNode = mix(vec3(c0 as unknown as TSLNode), vec3(c1 as unknown as TSLNode), t)
  } else if (colorCount >= 3) {
    // Multi-stop gradient using pre-extracted uniforms
    const uniforms = [c0, c1, c2, c3, c4]
    const segments = colorCount - 1

    for (let i = 0; i < segments && i < 4; i++) {
      const localT = t.mul(segments).sub(i).clamp(0, 1)
      const currColor = uniforms[i] as unknown as TSLNode
      const nextColor = uniforms[i + 1] as unknown as TSLNode

      if (i === 0) {
        colorNode = mix(vec3(currColor), vec3(nextColor), localT)
      } else {
        const prevT = t
          .mul(segments)
          .sub(i - 1)
          .clamp(0, 1)
        colorNode = mix(colorNode, mix(vec3(currColor), vec3(nextColor), localT), prevT.step(1))
      }
    }
  }

  mat.colorNode = colorNode
  mat.transparent = props.transparent
  mat.side = DoubleSide

  return mat
})

defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>
