<script setup lang="ts">
  import { LinearGradient, CursorTrail } from 'shaders/vue'

  definePageMeta({ ssr: false, layout: false })
</script>

<template>
  <div class="min-h-screen bg-black p-6 text-white">
    <h1 class="mb-4 text-2xl font-semibold">Effects layer (shaders / WGSL)</h1>
    <FxSupport>
      <FxShader class="h-96 w-full">
        <LinearGradient color-a="#0f172a" color-b="#7c3aed" />
        <CursorTrail />
      </FxShader>
      <template #fallback>
        <p>WebGPU is not available in this browser.</p>
      </template>
    </FxSupport>
  </div>
</template>
