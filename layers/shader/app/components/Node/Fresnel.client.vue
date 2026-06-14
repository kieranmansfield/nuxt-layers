<script setup lang="ts">
  import { cameraPosition, normalView, positionWorld, pow, sub, uniform, vec3 } from 'three/tsl'

  const {
    id = 'fresnel',
    power = 2.0,
    order = 0,
    blend = 'add',
    opacity = 1.0,
  } = defineProps<{
    id?: string
    power?: number
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>()

  const graph = useShaderGraphContext()

  // Create uniforms once
  const uPower = uniform(power)

  // Build fresnel node
  const viewDirection = positionWorld.sub(cameraPosition).normalize()
  const fresnelFactor = pow(sub(1.0, normalView.dot(viewDirection.negate()).abs()), uPower)
  const node = vec3(fresnelFactor, fresnelFactor, fresnelFactor)

  graph.register(id, node, order, blend, opacity)

  watch(
    () => power,
    (v) => {
      uPower.value = v
    }
  )

  onUnmounted(() => {
    graph.unregister(id)
  })
</script>

<template>
  <slot />
</template>
