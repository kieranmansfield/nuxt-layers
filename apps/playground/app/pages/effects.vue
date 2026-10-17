<script setup lang="ts">
  import { CursorTrail, FilmGrain, LinearGradient } from 'shaders/vue'

  definePageMeta({ ssr: false, layout: false })

  const { supported } = useEffectsSupport()
</script>

<template>
  <div class="min-h-screen bg-black p-6 text-white">
    <h1 class="mb-1 text-2xl font-semibold">Effects layer (shaders / WGSL)</h1>
    <p class="mb-4 text-sm opacity-70">WebGPU: {{ supported ? 'available' : 'unavailable' }}</p>
    <FxShader class="h-96 w-full">
      <LinearGradient color-a="#0f172a" color-b="#7c3aed" />
      <FilmGrain />
      <CursorTrail />
      <template #fallback>
        <p>WebGPU is not available in this browser.</p>
      </template>
    </FxShader>
  </div>
</template>
