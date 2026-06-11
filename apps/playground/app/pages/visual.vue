<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('rose')
  onUnmounted(() => setPageAccent(null))

  const gradientPresets = ['brand', 'subtle', 'hero']
  const activeGradient = ref('brand')

  const tintLevels: Array<'subtle' | 'light' | 'medium' | 'strong' | 'heavy'> = [
    'subtle',
    'light',
    'medium',
    'strong',
    'heavy',
  ]
  const activeTintLevel = ref<'subtle' | 'light' | 'medium' | 'strong' | 'heavy'>('medium')

  const circularProgress = ref(64)

  const components = [
    {
      name: 'GradientBackground / GradientText',
      icon: 'i-lucide-paintbrush',
      description: 'Render preset or custom-config CSS gradients as a background or text fill',
    },
    {
      name: 'TintOverlay',
      icon: 'i-lucide-layers-2',
      description: 'Semi-transparent colour overlay using semantic colour roles + opacity levels',
    },
    {
      name: 'AccentBlob / AccentScene',
      icon: 'i-lucide-circle-dashed',
      description: 'Soft blurred colour blobs positioned in a scene, driven by useAccentBlob()',
    },
    {
      name: 'Progress Bar / Circular',
      icon: 'i-lucide-loader-circle',
      description: 'Linear and circular progress indicators with semantic colours',
    },
    {
      name: 'Media Picture',
      icon: 'i-lucide-image',
      description:
        'Responsive <picture> rendering with format + sizes negotiation via usePicture()',
    },
    {
      name: 'Base Modal',
      icon: 'i-lucide-square',
      description: 'Headless modal primitive used by useConfirmModal / useInfoModal / useFormModal',
    },
  ]
</script>

<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/max-template-depth -->
<!-- eslint-disable vue/v-on-handler-style -->
<template>
  <LayoutPage
    title="Visual Layer Demo"
    description="Gradients, tints, accent blobs, progress indicators, and responsive media"
  >
    <div class="bg-gray-950 min-h-screen">
      <DemoPageHero
        name="VISUAL LAYER"
        description="The decorative building blocks behind the UI layer — gradients, tints, accent blobs, progress indicators, responsive pictures, and the modal primitive."
      >
        <template #background>
          <AccentScene preset="hero" class="absolute inset-0 opacity-60" />
        </template>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" @click="$router.push('#gradients')">Gradients & Tints</UButton>
          <UButton size="lg" variant="outline" @click="$router.push('#progress')">
            Progress
          </UButton>
          <UButton size="lg" variant="ghost" to="/ui">
            <UIcon name="i-lucide-palette" class="mr-2" />
            UI Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Gradients & Tints -->
      <section id="gradients" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Gradients & Tints</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useGradient()</code> resolves preset names from
              <code class="text-primary">app.config.uiLayer.gradients</code>
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 class="text-lg font-bold text-white mb-4">GradientBackground presets</h3>
              <div class="flex gap-2 mb-4">
                <UButton
                  v-for="preset in gradientPresets"
                  :key="preset"
                  size="sm"
                  :variant="activeGradient === preset ? 'solid' : 'outline'"
                  @click="() => (activeGradient = preset)"
                >
                  {{ preset }}
                </UButton>
              </div>
              <GradientBackground
                :preset="activeGradient"
                class="h-48 rounded-2xl flex items-center justify-center"
              >
                <code class="text-white/90 font-mono text-sm bg-black/30 px-3 py-1.5 rounded-lg">
                  preset="{{ activeGradient }}"
                </code>
              </GradientBackground>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white mb-4">TintOverlay levels</h3>
              <div class="flex gap-2 mb-4">
                <UButton
                  v-for="level in tintLevels"
                  :key="level"
                  size="sm"
                  :variant="activeTintLevel === level ? 'solid' : 'outline'"
                  @click="() => (activeTintLevel = level)"
                >
                  {{ level }}
                </UButton>
              </div>
              <div
                class="relative h-48 rounded-2xl overflow-hidden bg-linear-to-br from-blue-600 to-purple-700"
              >
                <TintOverlay color="primary" :level="activeTintLevel" class="absolute inset-0" />
                <div class="relative z-10 h-full flex items-center justify-center">
                  <code class="text-white font-mono text-sm bg-black/30 px-3 py-1.5 rounded-lg">
                    level="{{ activeTintLevel }}"
                  </code>
                </div>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Accent blobs -->
      <section class="py-24 bg-gray-950 overflow-hidden">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Accent Blobs</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useAccentBlob()</code> +
              <code class="text-primary">AccentScene</code>
              — soft blurred shapes positioned by percentage coordinates
            </p>
          </div>
          <div class="relative h-72 rounded-3xl overflow-hidden bg-gray-950 max-w-4xl mx-auto">
            <AccentBlob :x="20" :y="30" size="14rem" color="primary" :opacity="50" blur="3xl" />
            <AccentBlob :x="75" :y="60" size="10rem" color="secondary" :opacity="40" blur="2xl" />
            <AccentBlob :x="50" :y="85" size="8rem" color="info" :opacity="35" blur="xl" />
            <div class="relative z-10 h-full flex items-center justify-center">
              <code class="text-white/80 font-mono text-sm bg-black/30 px-3 py-1.5 rounded-lg">
                &lt;AccentBlob :x :y size color opacity blur /&gt;
              </code>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Progress -->
      <section id="progress" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Progress Indicators</h2>
            <p class="text-gray-400 text-lg">Linear and circular progress, semantic colours</p>
          </div>
          <div class="max-w-2xl mx-auto space-y-10">
            <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <p class="text-sm text-gray-400 mb-4">ProgressBar — value: {{ circularProgress }}%</p>
              <ProgressBar :progress="circularProgress / 100" color="primary" size="lg" />
              <input
                v-model.number="circularProgress"
                type="range"
                min="0"
                max="100"
                class="w-full mt-6"
              />
            </div>
            <div
              class="bg-gray-800 rounded-2xl p-8 border border-gray-700 flex items-center justify-center"
            >
              <ProgressCircular
                :progress="circularProgress / 100"
                :size="140"
                :stroke-width="10"
                show-percentage
              />
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Surface -->
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Component Surface</h2>
            <p class="text-gray-400 text-lg">Everything the UI layer composes from Visual</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div
              v-for="item in components"
              :key="item.name"
              class="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <UIcon :name="item.icon" class="text-2xl text-primary mb-3" />
              <h3 class="text-white font-bold mb-2">{{ item.name }}</h3>
              <p class="text-gray-400 text-sm">{{ item.description }}</p>
            </div>
          </div>
        </UContainer>
      </section>

      <DemoPageFooter
        name="Visual Layer"
        description="Gradients, tints, blobs, progress, and media"
        :links="[
          { label: 'UI Layer', to: '/ui', icon: 'i-lucide-palette' },
          { label: 'Overlays', to: '/overlays', icon: 'i-lucide-layers' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
