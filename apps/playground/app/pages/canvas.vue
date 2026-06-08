<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('violet')
  onUnmounted(() => setPageAccent(null))

  const { back } = useBackNavigation('/shader')

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

  function onCanvasReady(context: any) {
    if (context?.renderer) {
      detectFromRenderer(context.renderer)
    }
  }
</script>

<template>
  <LayoutPage
    title="Canvas Layer Demo"
    description="WebGL/WebGPU rendering context — TresJS canvas, shader clock, and renderer capabilities"
  >
    <div class="canvas-page">
      <!-- Hero -->
      <section
        class="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
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
              <TresMeshStandardMaterial color="#6366f1" :wireframe="false" />
            </TresMesh>
          </ShaderCanvas>
        </ClientOnly>
        <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-gray-950" />
        <div class="text-center z-10 px-4">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8">
            <span class="text-primary">CANVAS</span> LAYER
          </h1>
          <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            The TresJS rendering foundation that powers the Shader layer — WebGL/WebGPU context, a
            controllable shader clock, and renderer capability detection.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" @click="$router.push('#clock')">Shader Clock</UButton>
            <UButton size="lg" variant="outline" to="/shader">
              <UIcon name="i-lucide-shapes" class="mr-2" />
              Shader Layer
            </UButton>
            <UButton size="lg" variant="ghost" @click="back()">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Back
            </UButton>
          </div>
        </div>
      </section>

      <!-- Shader clock -->
      <section id="clock" class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">useShaderTime()</h2>
            <p class="text-gray-400 text-lg">
              A controllable clock — the rotating mesh above is driven by
              <code class="text-primary">elapsed</code>
            </p>
          </div>
          <div class="max-w-2xl mx-auto bg-gray-950 rounded-2xl p-8 border border-gray-800">
            <div class="grid sm:grid-cols-2 gap-4 mb-8">
              <div class="bg-gray-800 rounded-xl p-4 text-center">
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Elapsed</p>
                <p class="text-2xl font-bold text-primary font-mono">{{ elapsed.toFixed(2) }}s</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-4 text-center">
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Speed</p>
                <p class="text-2xl font-bold text-primary font-mono">{{ speed.toFixed(2) }}×</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 justify-center mb-6">
              <UButton
                v-for="preset in speedPresets"
                :key="preset"
                size="sm"
                :variant="speed === preset ? 'solid' : 'outline'"
                @click="setSpeed(preset)"
              >
                {{ preset }}×
              </UButton>
            </div>
            <div class="flex flex-wrap gap-3 justify-center">
              <UButton v-if="isRunning" variant="outline" @click="pause">
                <UIcon name="i-lucide-pause" class="mr-2" />
                Pause
              </UButton>
              <UButton v-else @click="resume">
                <UIcon name="i-lucide-play" class="mr-2" />
                Resume
              </UButton>
              <UButton variant="ghost" @click="reset">
                <UIcon name="i-lucide-rotate-ccw" class="mr-2" />
                Reset
              </UButton>
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
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div class="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Backend</p>
              <p class="text-lg font-bold" :class="isWebGPU ? 'text-violet-400' : 'text-cyan-400'">
                {{ isReady ? backend.toUpperCase() : '…' }}
              </p>
            </div>
            <div class="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Max Texture Size</p>
              <p class="text-lg font-bold text-white">{{ isReady ? maxTextureSize : '…' }}</p>
            </div>
            <div class="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Precision</p>
              <p class="text-lg font-bold text-white">{{ capabilities?.precision ?? '…' }}</p>
            </div>
            <div class="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">Pixel Ratio</p>
              <p class="text-lg font-bold text-white">
                {{ capabilities?.devicePixelRatio?.toFixed(1) ?? '…' }}
              </p>
            </div>
          </div>

          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-white mb-2">Auto Quality</h3>
            <p class="text-gray-400 text-sm">
              Detected level: <span class="text-primary font-mono">{{ quality }}</span> — particles:
              {{ qualitySettings.particleCount }}, shadows:
              {{ qualitySettings.shadowsEnabled ? 'on' : 'off' }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3 justify-center">
            <UButton
              v-for="level in qualityLevels"
              :key="level"
              size="sm"
              :variant="quality === level ? 'solid' : 'outline'"
              @click="setQuality(level)"
            >
              {{ level }}
            </UButton>
          </div>
        </UContainer>
      </section>

      <!-- Footer Nav -->
      <section class="py-16 bg-gray-900">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Canvas Layer</h2>
              <p class="text-gray-400">WebGL/WebGPU foundation for the Shader layer</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/shader">
                <UIcon name="i-lucide-shapes" class="mr-2" />
                Shader Layer
              </UButton>
              <UButton variant="outline" @click="back()">Back</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
