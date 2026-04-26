<script setup lang="ts">
// @ts-nocheck - TSL types are complex
import { DoubleSide } from 'three'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { float, positionLocal, uv, vec3, vec4 } from 'three/tsl'

const { transparent = false } = defineProps<{
  transparent?: boolean
}>()

const pipeline = useShaderPipelineContext()

const material = new MeshBasicNodeMaterial()
material.side = DoubleSide
if (transparent) {
  material.transparent = true
}

// Starting node for the ray pipeline: centred screen coord → normalised ray direction.
// Ray transformer blocks (Phase 4) refine this — FisheyeRay, RayTiltBasis, etc.
const screenRayNode = vec3(uv().sub(0.5).mul(2.0), float(1.0)).normalize()

watch(
  pipeline.version,
  () => {
    const uvStages = pipeline.stagesFor('uv')
    const fragment = pipeline.stagesFor('fragment')
    const vertex = pipeline.stagesFor('vertex')
    const ray = pipeline.stagesFor('ray')

    // UV chain — generators read pipeline.uvNode.value in their stage fn closures
    pipeline.uvNode.value = uvStages.reduce((node, { fn }) => fn(node), uv())

    // Ray chain — sky/tunnel generators read pipeline.rayNode.value in their closures
    pipeline.rayNode.value = ray.reduce((node, { fn }) => fn(node), screenRayNode)

    // Fragment chain
    material.colorNode = fragment.reduce((node, { fn }) => fn(node), vec4(0, 0, 0, 1))
    material.needsUpdate = true

    if (vertex.length > 0) {
      material.positionNode = vertex.reduce((node, { fn }) => fn(node), positionLocal)
      material.needsUpdate = true
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  try { material.dispose() } catch { /* renderer already torn down */ }
})
</script>

<template>
  <primitive :object="material" attach="material" />
</template>
