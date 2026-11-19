<script setup lang="ts">
  import { DoubleSide } from 'three'
  import { float, Fn, positionLocal, uv, vec3, vec4 } from 'three/tsl'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

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

      // Wrap each chain in Fn() so TSL .toVar()/.assign() ops (used by noise functions
      // like simplexNoise3d) have a valid stack context. Without this, TSL throws
      // "No stack defined for assign operation".
      pipeline.uvNode.value = Fn(() => uvStages.reduce((node, { fn }) => fn(node), uv()))()
      pipeline.rayNode.value = Fn(() => ray.reduce((node, { fn }) => fn(node), screenRayNode))()
      material.colorNode = Fn(() => fragment.reduce((node, { fn }) => fn(node), vec4(0, 0, 0, 1)))()
      material.needsUpdate = true

      if (vertex.length > 0) {
        material.positionNode = Fn(() => vertex.reduce((node, { fn }) => fn(node), positionLocal))()
        material.needsUpdate = true
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    try {
      material.dispose()
    } catch {
      /* renderer already torn down */
    }
  })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>
