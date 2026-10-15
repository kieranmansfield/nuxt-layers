<script setup lang="ts">
  import type { TresContext } from '@tresjs/core'
  import type { WebGLRenderer } from 'three'
  import type { WebGPURenderer } from 'three/webgpu'

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

  function onCanvasReady(context: TresContext) {
    if (context?.renderer?.instance) {
      detectFromRenderer(context.renderer.instance as WebGPURenderer | WebGLRenderer)
    }
  }
</script>

<template>
  <LayoutPage
    title="Canvas Layer Demo"
    description="WebGL/WebGPU rendering context — TresJS canvas, shader clock, and renderer capabilities"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="CANVAS LAYER"
        description="The TresJS rendering foundation that powers the Shader layer — WebGL/WebGPU context, a controllable shader clock, and renderer capability detection."
      >
        <template #background>
          <ClientOnly>
            <div class="absolute inset-0">
              <ShaderCanvas
                clear-color="#050505"
                :window-size="false"
                style="pointer-events: none"
                webgpu
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
            </div>
          </ClientOnly>
        </template>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#clock')">Shader Clock</UButton>
          <UButton size="lg" variant="outline" to="/shader">
            <UIcon name="i-lucide-shapes" class="mr-2" />
            Shader Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Shader clock -->
      <section id="clock" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">useShaderTime()</h2>
            <p class="text-muted text-lg">
              A controllable clock — the rotating mesh above is driven by
              <code class="text-primary">elapsed</code>
            </p>
          </div>
          <div class="border-default mx-auto max-w-2xl overflow-hidden rounded-2xl border">
            <!-- Status bar -->
            <div
              class="bg-muted border-default flex items-center justify-between border-b px-6 py-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="h-2 w-2 rounded-full transition-colors"
                  :class="isRunning ? 'bg-emerald-400' : 'bg-accented'"
                />
                <span class="text-muted font-mono text-sm tracking-widest uppercase">
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
            <div class="bg-default grid grid-cols-2 divide-x divide-gray-800">
              <div class="p-8">
                <p class="text-muted mb-3 text-xs tracking-widest uppercase">Elapsed</p>
                <p class="text-primary font-mono text-5xl font-bold tabular-nums">
                  {{ elapsed.toFixed(2) }}
                  <span class="text-muted text-2xl">s</span>
                </p>
              </div>
              <div class="p-8">
                <p class="text-muted mb-3 text-xs tracking-widest uppercase">Speed</p>
                <p class="text-primary font-mono text-5xl font-bold tabular-nums">
                  {{ speed.toFixed(2) }}
                  <span class="text-muted text-2xl">×</span>
                </p>
              </div>
            </div>
            <!-- Speed presets -->
            <div class="bg-muted border-default border-t px-6 py-5">
              <p class="text-muted mb-3 text-xs tracking-widest uppercase">Playback Speed</p>
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
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              Renderer Capabilities
            </h2>
            <p class="text-muted text-lg">
              <code class="text-primary">useRendererCapabilities()</code> +
              <code class="text-primary">useAutoQuality()</code> — detected from the canvas above
            </p>
          </div>
          <div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <!-- Renderer info panel -->
            <div class="border-default overflow-hidden rounded-2xl border">
              <div class="bg-muted border-default border-b px-6 py-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-cpu" class="text-primary" />
                  <h3 class="text-highlighted font-semibold">Renderer Info</h3>
                </div>
              </div>
              <div class="bg-default divide-y divide-gray-800">
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Backend</span>
                  <span
                    class="font-mono text-sm font-semibold"
                    :class="isWebGPU ? 'text-violet-400' : 'text-primary'"
                  >
                    {{ isReady ? backend.toUpperCase() : '…' }}
                  </span>
                </div>
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Max Texture Size</span>
                  <span class="text-highlighted font-mono text-sm">
                    {{ isReady ? maxTextureSize.toLocaleString() : '…' }}
                  </span>
                </div>
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Precision</span>
                  <span class="text-highlighted font-mono text-sm">{{
                    capabilities?.precision ?? '…'
                  }}</span>
                </div>
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Pixel Ratio</span>
                  <span class="text-highlighted font-mono text-sm">
                    {{ capabilities?.devicePixelRatio?.toFixed(1) ?? '…' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Auto quality panel -->
            <div class="border-default overflow-hidden rounded-2xl border">
              <div class="bg-muted border-default border-b px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-sliders-horizontal" class="text-primary" />
                    <h3 class="text-highlighted font-semibold">Auto Quality</h3>
                  </div>
                  <UBadge color="primary" variant="subtle" class="capitalize">{{ quality }}</UBadge>
                </div>
              </div>
              <div class="bg-default divide-y divide-gray-800">
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Particle Count</span>
                  <span class="text-highlighted font-mono text-sm">{{
                    qualitySettings.particleCount.toLocaleString()
                  }}</span>
                </div>
                <div class="flex items-center justify-between px-6 py-4">
                  <span class="text-muted text-sm">Shadows</span>
                  <UBadge
                    variant="subtle"
                    :color="qualitySettings.shadows ? 'success' : 'neutral'"
                    size="xs"
                  >
                    {{ qualitySettings.shadows ? 'Enabled' : 'Disabled' }}
                  </UBadge>
                </div>
              </div>
              <div class="bg-muted border-default border-t px-6 py-5">
                <p class="text-muted mb-3 text-xs tracking-widest uppercase">Override Level</p>
                <div class="grid grid-cols-4 gap-2">
                  <UButton
                    v-for="level in qualityLevels"
                    :key="level"
                    size="sm"
                    :variant="quality === level ? 'solid' : 'ghost'"
                    class="w-full capitalize"
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
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">
              Shader Image Effects
            </h2>
            <p class="text-muted text-lg">
              Chromatic aberration, wave distortion, and vignette via
              <code class="text-primary">ShaderImageDemo</code>
            </p>
          </div>
          <div class="border-default mx-auto max-w-3xl overflow-hidden rounded-2xl border">
            <ClientOnly>
              <div class="h-[420px]">
                <ShaderImageDemo :rgb-shift :distortion :vignette="vignetteEnabled" />
              </div>
            </ClientOnly>
            <!-- Controls -->
            <div class="bg-muted border-default grid gap-6 border-t px-6 py-5 sm:grid-cols-3">
              <div>
                <p class="text-muted mb-2 text-xs tracking-widest uppercase">
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
                <p class="text-muted mb-2 text-xs tracking-widest uppercase">
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
