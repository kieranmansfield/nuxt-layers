<script setup lang="ts">
// @ts-nocheck - TSL types
import {
  cameraPosition,
  normalView,
  positionWorld,
  pow,
  sub,
  uniform,
  vec3,
} from 'three/tsl'

const props = withDefaults(
  defineProps<{
    id?: string
    power?: number
    color?: string
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>(),
  {
    id: 'fresnel',
    power: 2.0,
    color: '#ffffff',
    order: 0,
    blend: 'add',
    opacity: 1.0,
  }
)

const graph = useShaderGraphContext()

// Create uniforms once
const uPower = uniform(props.power)

// Build fresnel node
const viewDirection = positionWorld.sub(cameraPosition).normalize()
const fresnelFactor = pow(sub(1.0, normalView.dot(viewDirection.negate()).abs()), uPower)
const node = vec3(fresnelFactor, fresnelFactor, fresnelFactor)

graph.register(props.id, node, props.order, props.blend, props.opacity)

watch(() => props.power, (v) => { uPower.value = v })

onUnmounted(() => {
  graph.unregister(props.id)
})
</script>

<template>
  <slot />
</template>
