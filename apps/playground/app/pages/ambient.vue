<script setup lang="ts">
  import type { Component } from 'vue'
  import AuroraPreset from '#layers/shader/app/components/Preset/Aurora.client.vue'
  import FlowPreset from '#layers/shader/app/components/Preset/Flow.client.vue'
  import GradientMeshPreset from '#layers/shader/app/components/Preset/GradientMesh.client.vue'
  import NebulaPreset from '#layers/shader/app/components/Preset/Nebula.client.vue'
  import OceanPreset from '#layers/shader/app/components/Preset/Ocean.client.vue'
  import ShaderHost from '#layers/shader/app/components/Shader/Host.client.vue'
  import ShaderRuntime from '#layers/shader/app/components/Shader/Runtime.client.vue'

  definePageMeta({ ssr: false, layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('emerald')
  onUnmounted(() => setPageAccent(null))

  type PresetType = 'aurora' | 'nebula' | 'flow' | 'gradientMesh' | 'ocean'

  const activePreset = ref<PresetType>('aurora')
  const speed = ref(1.0)
  const intensity = ref(1.0)
  const mouseInteraction = ref(true)

  // Static imports ensure preset components mount and emit @node during setup,
  // before ShaderBackground's onMounted fires — so compileAsync gets a live colorNode.
  const presetComponents: Record<PresetType, Component> = {
    aurora: AuroraPreset,
    nebula: NebulaPreset,
    flow: FlowPreset,
    gradientMesh: GradientMeshPreset,
    ocean: OceanPreset,
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
  <LayoutPage
    title="Ambient Backgrounds"
    description="Beautiful TSL-powered ambient backgrounds using WebGPU"
  >
    <div class="bg-default text-highlighted min-h-screen">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div
          class="absolute inset-0 bg-linear-to-br from-violet-900/20 via-transparent to-cyan-900/10"
        />

        <UContainer class="relative py-12">
          <div class="mb-6 flex items-center gap-4">
            <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" class="text-muted" />
            <UBadge color="primary" variant="subtle">Ambient Backgrounds</UBadge>
            <UBadge color="success" variant="subtle">WebGPU + TresJS</UBadge>
          </div>

          <h1 class="mb-4 text-4xl font-black md:text-5xl">
            <span class="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Ambient
            </span>
            Backgrounds
          </h1>

          <p class="text-muted mb-8 max-w-xl text-lg">
            Beautiful, animated backgrounds powered by TSL shader functions. Combine noise,
            gradients, and effects for stunning visuals.
          </p>
        </UContainer>
      </section>

      <!-- Main Demo Section -->
      <section class="py-8">
        <UContainer>
          <div class="grid gap-8 lg:grid-cols-3">
            <!-- Preview Canvas -->
            <div class="lg:col-span-2">
              <div class="bg-muted relative aspect-video overflow-hidden rounded-2xl">
                <!-- Static imports of *.client.vue bypass Nuxt's client-only handling, so the
                     server would render them; ClientOnly keeps server and client output equal. -->
                <ClientOnly>
                  <ShaderRuntime :speed :mouse-smoothing="0.1">
                    <ShaderHost
                      :preset="currentPresetComponent"
                      :transition-duration="1.0"
                      :preset-props="{ speed, intensity, mouseInteraction }"
                      clear-color="#000000"
                      :fixed="false"
                      pointer-events="auto"
                      :z-index="0"
                  /></ShaderRuntime>
                </ClientOnly>

                <!-- Overlay info -->
                <div
                  class="pointer-events-none absolute top-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-sm backdrop-blur"
                >
                  {{ mouseInteraction ? 'Move mouse to interact' : 'Mouse disabled' }}
                </div>

                <div class="pointer-events-none absolute right-4 bottom-4 flex gap-2">
                  <span class="rounded bg-black/60 px-2 py-1 text-xs backdrop-blur">
                    {{ activePreset }}
                  </span>
                </div>
              </div>

              <!-- Preset selector cards -->
              <div class="mt-6 grid grid-cols-5 gap-3">
                <button
                  v-for="preset in presets"
                  :key="preset.id"
                  class="rounded-xl border p-3 text-left transition-all"
                  :class="[
                    activePreset === preset.id
                      ? 'border-violet-500 bg-violet-600/20'
                      : 'bg-accented/50 border-accented hover:border-accented',
                  ]"
                  @click="() => (activePreset = preset.id)"
                >
                  <!-- Color preview -->
                  <div class="mb-2 flex gap-1">
                    <div
                      v-for="(color, i) in preset.colors.slice(0, 3)"
                      :key="i"
                      class="h-4 w-4 rounded-full"
                      :style="{ backgroundColor: color }"
                    />
                  </div>
                  <div class="truncate text-sm font-medium">{{ preset.name }}</div>
                </button>
              </div>
            </div>

            <!-- Controls Panel -->
            <div class="space-y-6">
              <!-- Current preset info -->
              <div class="bg-accented/50 border-accented rounded-xl border p-5">
                <h3 class="mb-2 font-semibold">
                  {{ presets.find((p) => p.id === activePreset)?.name }}
                </h3>
                <p class="text-muted mb-4 text-sm">
                  {{ presets.find((p) => p.id === activePreset)?.description }}
                </p>

                <!-- Color swatches -->
                <div class="flex gap-2">
                  <div
                    v-for="(color, i) in presets.find((p) => p.id === activePreset)?.colors"
                    :key="i"
                    class="h-8 w-8 rounded-lg border border-white/10"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  />
                </div>
              </div>

              <!-- Controls -->
              <div class="bg-accented/50 border-accented space-y-4 rounded-xl border p-5">
                <h4 class="text-sm font-semibold text-violet-400">Controls</h4>

                <div class="space-y-4">
                  <div>
                    <div class="text-muted mb-1 flex justify-between text-xs">
                      <span>Speed</span>
                      <span>{{ speed.toFixed(1) }}x</span>
                    </div>
                    <input
                      v-model.number="speed"
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      class="bg-accented h-2 w-full cursor-pointer appearance-none rounded-lg accent-violet-500"
                    />
                  </div>

                  <div>
                    <div class="text-muted mb-1 flex justify-between text-xs">
                      <span>Intensity</span>
                      <span>{{ intensity.toFixed(1) }}</span>
                    </div>
                    <input
                      v-model.number="intensity"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      class="bg-accented h-2 w-full cursor-pointer appearance-none rounded-lg accent-violet-500"
                    />
                  </div>

                  <!-- Toggle -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-muted text-xs">Mouse Interaction</span>
                    <USwitch v-model="mouseInteraction" />
                  </div>
                </div>
              </div>

              <!-- TSL Functions Used -->
              <div class="bg-accented/50 border-accented rounded-xl border p-5">
                <h4 class="mb-3 text-sm font-semibold text-cyan-400">TSL Functions</h4>
                <div class="flex flex-wrap gap-2">
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">fbm2D</code>
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">
                    simplexNoise2D
                  </code>
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">
                    cosinePalette
                  </code>
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">
                    voronoi2D
                  </code>
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">
                    ridgedFbm2d
                  </code>
                  <code class="bg-accented rounded px-2 py-1 text-xs text-violet-300">
                    warpedFbmCoords
                  </code>
                </div>
              </div>

              <!-- WebGPU Info -->
              <div
                class="bg-accented/30 border-accented/50 text-muted rounded-xl border p-4 text-xs"
              >
                <p class="mb-2">
                  <strong class="text-muted">Note:</strong> These backgrounds use TSL (Three.js
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
      <section class="border-default border-t py-12">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 class="mb-1 text-xl font-bold">Ambient Backgrounds</h2>
              <p class="text-muted text-sm">TSL-powered procedural graphics via TresJS</p>
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
  </LayoutPage>
</template>
