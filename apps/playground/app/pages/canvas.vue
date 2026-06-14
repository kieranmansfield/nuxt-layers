<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('cyan')
  onUnmounted(() => setPageAccent(null))

  const { elapsed, speed, isRunning, pause, resume, reset, setSpeed } = useShaderTime()
  const { capabilities, isReady, isWebGPU, backend, maxTextureSize, detectFromRenderer } =
    useRendererCapabilities()
  const { quality, settings: qualitySettings, setQuality } = useAutoQuality()

  const speedPresets = [0.25, 0.5, 1, 2, 4]
  const qualityLevels: Array<'low' | 'medium' | 'high' | 'ultra'> = [
    'low',
    'medium',
    'high',
    'ultra',
  ]

  const rgbShift = ref(2)
  const distortion = ref(0.03)
  const vignetteEnabled = ref(true)

  function onCanvasReady(context: any) {
    if (context?.renderer?.instance) {
      detectFromRenderer(context.renderer.instance)
    }
  }
</script>

<template>
  <LayoutPage
    title="Canvas Layer Demo"
    description="WebGL/WebGPU rendering context — TresJS canvas, shader clock, and renderer capabilities"
  >
    <div class="bg-gray-950 min-h-screen">
      <DemoPageHero
        name="CANVAS LAYER"
        description="The TresJS rendering foundation that powers the Shader layer — WebGL/WebGPU context, a controllable shader clock, and renderer capability detection."
      >
        <template #background>
          <ClientOnly>
            <ShaderCanvas
              clear-color="#050505"
              class="absolute inset-0"
              :webgpu="true"
              @ready="onCanvasReady"
            >
              <TresPerspectiveCamera :position="[0, 0, 3]" />
              <TresAmbientLight :intensity="0.6" />
              <TresDirectionalLight :position="[2, 2, 2]" :intensity="1" />
              <TresMesh :rotation="[elapsed * 0.3, elapsed * 0.5, 0]">
                <TresIcosahedronGeometry :args="[1, 0]" />
                <TresMeshStandardMaterial color="#06b6d4" :wireframe="false" />
              </TresMesh>
            </ShaderCanvas>
          </ClientOnly>
        </template>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" @click="() => $router.push('#clock')">Shader Clock</UButton>
          <UButton size="lg" variant="outline" to="/shader">
            <UIcon name="i-lucide-shapes" class="mr-2" />
            Shader Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Shader clock -->
      <section id="clock" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">useShaderTime()</h2>
            <p class="text-gray-400 text-lg">
              A controllable clock — the rotating mesh above is driven by
              <code class="text-primary">elapsed</code>
            </p>
          </div>
          <div class="max-w-2xl mx-auto rounded-2xl border border-gray-800 overflow-hidden">
            <!-- Status bar -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="isRunning ? 'bg-emerald-400' : 'bg-gray-600'"
                />
                <span class="font-mono text-sm text-gray-400 uppercase tracking-widest">
                  {{ isRunning ? 'Running' : 'Paused' }}
                </span>
              </div>
              <div class="flex gap-2">
                <UButton
                  size="sm"
                  :variant="isRunning ? 'outline' : 'solid'"
                  @click="() => (isRunning ? pause() : resume())"
                >
                  <UIcon :name="isRunning ? 'i-lucide-pause' : 'i-lucide-play'" class="mr-1.5" />
                  {{ isRunning ? 'Pause' : 'Resume' }}
                </UButton>
                <UButton size="sm" variant="ghost" @click="reset">
                  <UIcon name="i-lucide-rotate-ccw" class="mr-1.5" />
                  Reset
                </UButton>
              </div>
            </div>
            <!-- Stats -->
            <div class="grid grid-cols-2 divide-x divide-gray-800 bg-gray-950">
              <div class="p-8">
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-3">Elapsed</p>
                <p class="text-5xl font-bold text-primary font-mono tabular-nums">
                  {{ elapsed.toFixed(2) }}
                  <span class="text-2xl text-gray-500">s</span>
                </p>
              </div>
              <div class="p-8">
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-3">Speed</p>
                <p class="text-5xl font-bold text-primary font-mono tabular-nums">
                  {{ speed.toFixed(2) }}
                  <span class="text-2xl text-gray-500">×</span>
                </p>
              </div>
            </div>
            <!-- Speed presets -->
            <div class="px-6 py-5 bg-gray-900 border-t border-gray-800">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-3">Playback Speed</p>
              <div class="grid grid-cols-5 gap-2">
                <UButton
                  v-for="preset in speedPresets"
                  :key="preset"
                  size="sm"
                  :variant="speed === preset ? 'solid' : 'ghost'"
                  class="w-full"
                  @click="() => setSpeed(preset)"
                >
                  {{ preset }}×
                </UButton>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Capabilities -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Renderer Capabilities</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useRendererCapabilities()</code> +
              <code class="text-primary">useAutoQuality()</code> — detected from the canvas above
            </p>
          </div>
          <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <!-- Renderer info panel -->
            <div class="rounded-2xl border border-gray-800 overflow-hidden">
              <div class="px-6 py-4 bg-gray-900 border-b border-gray-800">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-cpu" class="text-primary" />
                  <h3 class="font-semibold text-white">Renderer Info</h3>
                </div>
              </div>
              <div class="divide-y divide-gray-800 bg-gray-950">
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Backend</span>
                  <span
                    class="font-mono text-sm font-semibold"
                    :class="isWebGPU ? 'text-violet-400' : 'text-primary'"
                  >
                    {{ isReady ? backend.toUpperCase() : '…' }}
                  </span>
                </div>
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Max Texture Size</span>
                  <span class="font-mono text-sm text-white">
                    {{ isReady ? maxTextureSize.toLocaleString() : '…' }}
                  </span>
                </div>
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Precision</span>
                  <span class="font-mono text-sm text-white">{{
                    capabilities?.precision ?? '…'
                  }}</span>
                </div>
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Pixel Ratio</span>
                  <span class="font-mono text-sm text-white">
                    {{ capabilities?.devicePixelRatio?.toFixed(1) ?? '…' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Auto quality panel -->
            <div class="rounded-2xl border border-gray-800 overflow-hidden">
              <div class="px-6 py-4 bg-gray-900 border-b border-gray-800">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-sliders-horizontal" class="text-primary" />
                    <h3 class="font-semibold text-white">Auto Quality</h3>
                  </div>
                  <UBadge color="primary" variant="subtle" class="capitalize">{{ quality }}</UBadge>
                </div>
              </div>
              <div class="divide-y divide-gray-800 bg-gray-950">
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Particle Count</span>
                  <span class="font-mono text-sm text-white">{{
                    qualitySettings.particleCount.toLocaleString()
                  }}</span>
                </div>
                <div class="px-6 py-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Shadows</span>
                  <UBadge
                    variant="subtle"
                    :color="qualitySettings.shadows ? 'success' : 'neutral'"
                    size="xs"
                  >
                    {{ qualitySettings.shadows ? 'Enabled' : 'Disabled' }}
                  </UBadge>
                </div>
              </div>
              <div class="px-6 py-5 bg-gray-900 border-t border-gray-800">
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-3">Override Level</p>
                <div class="grid grid-cols-4 gap-2">
                  <UButton
                    v-for="level in qualityLevels"
                    :key="level"
                    size="sm"
                    :variant="quality === level ? 'solid' : 'ghost'"
                    class="capitalize w-full"
                    @click="() => setQuality(level)"
                  >
                    {{ level }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Shader Image Effects -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Shader Image Effects</h2>
            <p class="text-gray-400 text-lg">
              Chromatic aberration, wave distortion, and vignette via
              <code class="text-primary">ShaderImageDemo</code>
            </p>
          </div>
          <div class="max-w-3xl mx-auto rounded-2xl border border-gray-800 overflow-hidden">
            <ClientOnly>
              <div class="h-[420px]">
                <ShaderImageDemo :rgb-shift :distortion :vignette="vignetteEnabled" />
              </div>
            </ClientOnly>
            <!-- Controls -->
            <div class="grid sm:grid-cols-3 gap-6 px-6 py-5 bg-gray-900 border-t border-gray-800">
              <div>
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  RGB Shift — {{ rgbShift.toFixed(1) }}
                </p>
                <input
                  v-model.number="rgbShift"
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  class="w-full accent-cyan-500"
                />
              </div>
              <div>
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Distortion — {{ distortion.toFixed(3) }}
                </p>
                <input
                  v-model.number="distortion"
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.005"
                  class="w-full accent-cyan-500"
                />
              </div>
              <div class="flex items-end">
                <UButton
                  :variant="vignetteEnabled ? 'solid' : 'ghost'"
                  class="w-full justify-center"
                  @click="() => (vignetteEnabled = !vignetteEnabled)"
                >
                  <UIcon
                    :name="vignetteEnabled ? 'i-lucide-circle-dot' : 'i-lucide-circle'"
                    class="mr-2"
                  />
                  Vignette {{ vignetteEnabled ? 'On' : 'Off' }}
                </UButton>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <DemoPageFooter
        name="Canvas Layer"
        description="WebGL/WebGPU foundation for the Shader layer"
        :links="[{ label: 'Shader Layer', to: '/shader', icon: 'i-lucide-shapes' }]"
      />
    </div>
  </LayoutPage>
</template>
