<script setup lang="ts">
/**
 * Provides a ShaderPipeline context to its slot via the standard Vue DOM renderer.
 * Block components (which render <template />) must be placed inside this component,
 * NOT inside TresCanvas — TresJS's custom renderer crashes on null VNodes.
 *
 * Usage:
 *   <ShaderPipelineContext>
 *     <div class="hidden"><PipelineBlock ... /></div>   ← blocks in DOM
 *     <ShaderCanvas><TresMesh><ShaderPipeline /></TresMesh></ShaderCanvas>
 *   </ShaderPipelineContext>
 */
useShaderPipeline()
</script>

<template>
  <slot />
</template>
