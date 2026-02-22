<script setup lang="ts">
import type { Component } from 'vue'
import ShaderRuntime from '#layers/shader/app/components/Shader/Runtime.client.vue'
import ShaderHost from '#layers/shader/app/components/Shader/Host.client.vue'

definePageMeta({ ssr: false })

useSeoMeta({
  title: 'Ambient Backgrounds',
  description: 'Beautiful TSL-powered ambient backgrounds using WebGPU',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('emerald')
onUnmounted(() => setPageAccent(null))

type PresetType = 'aurora' | 'nebula' | 'flow' | 'gradientMesh' | 'ocean'

const activePreset = ref<PresetType>('aurora')
const speed = ref(1.0)
const intensity = ref(1.0)
const mouseInteraction = ref(true)

// Map preset IDs to lazy-loaded components
const presetComponents: Record<PresetType, Component> = {
  aurora: defineAsyncComponent(() => import('#layers/shader/app/components/Preset/Aurora.client.vue')),
  nebula: defineAsyncComponent(() => import('#layers/shader/app/components/Preset/Nebula.client.vue')),
  flow: defineAsyncComponent(() => import('#layers/shader/app/components/Preset/Flow.client.vue')),
  gradientMesh: defineAsyncComponent(() => import('#layers/shader/app/components/Preset/GradientMesh.client.vue')),
  ocean: defineAsyncComponent(() => import('#layers/shader/app/components/Preset/Ocean.client.vue')),
}

const currentPresetComponent = computed(() => presetComponents[activePreset.value])

const presets = [
  {
    id: 'aurora' as PresetType,
    name: 'Aurora Borealis',
    description: 'Northern lights with flowing curtains',
    colors: ['#0a0a20', '#00ff87', '#60efff'],
  },
  {
    id: 'nebula' as PresetType,
    name: 'Cosmic Nebula',
    description: 'Deep space clouds with stars',
    colors: ['#1a0a2e', '#ff6b6b', '#4ecdc4', '#ffe66d'],
  },
  {
    id: 'flow' as PresetType,
    name: 'Organic Flow',
    description: 'Domain-warped flowing patterns',
    colors: ['#134e5e', '#71b280', '#e8d5b7', '#fc5c7d'],
  },
  {
    id: 'gradientMesh' as PresetType,
    name: 'Gradient Mesh',
    description: 'Smooth animated color blobs',
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  },
  {
    id: 'ocean' as PresetType,
    name: 'Deep Ocean',
    description: 'Underwater caustics and waves',
    colors: ['#0a1628', '#1e3a5f', '#7ec8e3'],
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/10"
      />

      <UContainer class="relative py-12">
        <div class="flex items-center gap-4 mb-6">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" class="text-gray-400" />
          <UBadge color="primary" variant="subtle">Ambient Backgrounds</UBadge>
          <UBadge color="success" variant="subtle">WebGPU + TresJS</UBadge>
        </div>

        <h1 class="text-4xl md:text-5xl font-black mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"
            >Ambient</span
          >
          Backgrounds
        </h1>

        <p class="text-lg text-gray-400 max-w-xl mb-8">
          Beautiful, animated backgrounds powered by TSL shader functions. Combine noise, gradients,
          and effects for stunning visuals.
        </p>
      </UContainer>
    </section>

    <!-- Main Demo Section -->
    <section class="py-8">
      <UContainer>
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Preview Canvas -->
          <div class="lg:col-span-2">
            <div class="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative">
              <ShaderRuntime
                :speed="speed"
                :mouse-smoothing="0.1"
              >
                <ShaderHost
                  :preset="currentPresetComponent"
                  :transition-duration="1.0"
                  :preset-props="{ speed, intensity, mouseInteraction }"
                  clear-color="#000000"
                  :fixed="false"
                  pointer-events="auto"
                  :z-index="0"
                /></ShaderRuntime>

              <!-- Overlay info -->
              <div
                class="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm pointer-events-none"
              >
                {{ mouseInteraction ? 'Move mouse to interact' : 'Mouse disabled' }}
              </div>

              <div class="absolute bottom-4 right-4 flex gap-2 pointer-events-none">
                <span class="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs">
                  {{ activePreset }}
                </span>
              </div>
            </div>

            <!-- Preset selector cards -->
            <div class="grid grid-cols-5 gap-3 mt-6">
              <button
                v-for="preset in presets"
                :key="preset.id"
                class="p-3 rounded-xl border transition-all text-left"
                :class="[
                  activePreset === preset.id
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600',
                ]"
                @click="activePreset = preset.id"
              >
                <!-- Color preview -->
                <div class="flex gap-1 mb-2">
                  <div
                    v-for="(color, i) in preset.colors.slice(0, 3)"
                    :key="i"
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: color }"
                  />
                </div>
                <div class="text-sm font-medium truncate">{{ preset.name }}</div>
              </button>
            </div>
          </div>

          <!-- Controls Panel -->
          <div class="space-y-6">
            <!-- Current preset info -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 class="font-semibold mb-2">
                {{ presets.find((p) => p.id === activePreset)?.name }}
              </h3>
              <p class="text-sm text-gray-400 mb-4">
                {{ presets.find((p) => p.id === activePreset)?.description }}
              </p>

              <!-- Color swatches -->
              <div class="flex gap-2">
                <div
                  v-for="(color, i) in presets.find((p) => p.id === activePreset)?.colors"
                  :key="i"
                  class="w-8 h-8 rounded-lg border border-white/10"
                  :style="{ backgroundColor: color }"
                  :title="color"
                />
              </div>
            </div>

            <!-- Controls -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
              <h4 class="text-sm font-semibold text-violet-400">Controls</h4>

              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Speed</span>
                    <span>{{ speed.toFixed(1) }}x</span>
                  </div>
                  <input
                    v-model.number="speed"
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                <div>
                  <div class="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Intensity</span>
                    <span>{{ intensity.toFixed(1) }}</span>
                  </div>
                  <input
                    v-model.number="intensity"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                <!-- Toggle -->
                <div class="flex items-center justify-between pt-2">
                  <span class="text-xs text-gray-400">Mouse Interaction</span>
                  <USwitch v-model="mouseInteraction" />
                </div>
              </div>
            </div>

            <!-- TSL Functions Used -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h4 class="text-sm font-semibold text-cyan-400 mb-3">TSL Functions</h4>
              <div class="flex flex-wrap gap-2">
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300">fbm2D</code>
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300"
                  >simplexNoise2D</code
                >
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300"
                  >cosinePalette</code
                >
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300">voronoi2D</code>
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300"
                  >ridgedFbm2d</code
                >
                <code class="text-xs bg-gray-800 px-2 py-1 rounded text-violet-300"
                  >warpedFbmCoords</code
                >
              </div>
            </div>

            <!-- WebGPU Info -->
            <div
              class="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500"
            >
              <p class="mb-2">
                <strong class="text-gray-400">Note:</strong> These backgrounds use TSL (Three.js
                Shading Language) with TresJS components and WebGPU.
              </p>
              <p>
                WebGPU is supported in Chrome 113+, Edge 113+, and Firefox Nightly with flags
                enabled.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Footer -->
    <section class="py-12 border-t border-gray-800">
      <UContainer>
        <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <h2 class="text-xl font-bold mb-1">Ambient Backgrounds</h2>
            <p class="text-gray-400 text-sm">TSL-powered procedural graphics via TresJS</p>
          </div>
          <div class="flex gap-4">
            <UButton to="/shader" variant="outline">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Shader Layer
            </UButton>
            <UButton to="/"> Home </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
