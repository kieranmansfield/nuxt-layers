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
      name: 'Gradient',
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

<template>
  <LayoutPage
    title="Visual Layer Demo"
    description="Gradients, tints, accent blobs, progress indicators, and responsive media"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="VISUAL LAYER"
        description="The decorative building blocks behind the UI layer — gradients, tints, accent blobs, progress indicators, responsive pictures, and the modal primitive."
      >
        <template #background>
          <AccentScene preset="hero" class="absolute inset-0 opacity-60" />
        </template>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#gradients')">Gradients & Tints</UButton>
          <UButton size="lg" variant="outline" @click="() => $router.push('#progress')">
            Progress
          </UButton>
          <UButton size="lg" variant="ghost" to="/typography">
            <UIcon name="i-lucide-type" class="mr-2" />
            Typography
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Gradients & Tints -->
      <DemoSection id="gradients" title="Gradients & Tints">
        <template #description>
          <code class="text-primary">useGradient()</code> resolves preset names from
          <code class="text-primary">app.config.visualLayer.gradients</code>
        </template>

        <div class="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          <div>
            <h3 class="text-highlighted mb-4 text-lg font-bold">Gradient presets</h3>
            <div class="mb-4 flex gap-2">
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
            <Gradient
              :preset="activeGradient"
              class="flex h-48 items-center justify-center rounded-2xl"
            >
              <code
                class="text-highlighted/90 rounded-lg bg-black/30 px-3 py-1.5 font-mono text-sm"
              >
                preset="{{ activeGradient }}"
              </code>
            </Gradient>
          </div>

          <div>
            <h3 class="text-highlighted mb-4 text-lg font-bold">TintOverlay levels</h3>
            <div class="mb-4 flex gap-2">
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
              class="relative h-48 overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-purple-700"
            >
              <TintOverlay color="primary" :level="activeTintLevel" class="absolute inset-0" />
              <div class="relative z-10 flex h-full items-center justify-center">
                <code class="text-highlighted rounded-lg bg-black/30 px-3 py-1.5 font-mono text-sm">
                  level="{{ activeTintLevel }}"
                </code>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>

      <!-- Accent blobs -->
      <DemoSection class="overflow-hidden" title="Accent Blobs">
        <template #description>
          <code class="text-primary">useAccentBlob()</code> +
          <code class="text-primary">AccentScene</code> — soft blurred shapes positioned by
          percentage coordinates
        </template>

        <div class="bg-default relative mx-auto h-72 max-w-4xl overflow-hidden rounded-3xl">
          <AccentBlob :x="20" :y="30" size="14rem" color="primary" :opacity="50" blur="3xl" />
          <AccentBlob :x="75" :y="60" size="10rem" color="secondary" :opacity="40" blur="2xl" />
          <AccentBlob :x="50" :y="85" size="8rem" color="info" :opacity="35" blur="xl" />
          <div class="relative z-10 flex h-full items-center justify-center">
            <code class="text-highlighted/80 rounded-lg bg-black/30 px-3 py-1.5 font-mono text-sm">
              &lt;AccentBlob :x :y size color opacity blur /&gt;
            </code>
          </div>
        </div>
      </DemoSection>

      <!-- Progress -->
      <DemoSection
        id="progress"
        title="Progress Indicators"
        description="Linear and circular progress, semantic colours"
      >
        <div class="mx-auto max-w-2xl space-y-10">
          <div class="bg-accented border-accented rounded-2xl border p-8">
            <p class="text-muted mb-4 text-sm">ProgressBar — value: {{ circularProgress }}%</p>
            <ProgressBar :progress="circularProgress / 100" color="primary" size="lg" />
            <input
              v-model.number="circularProgress"
              type="range"
              min="0"
              max="100"
              class="mt-6 w-full"
            />
          </div>
          <div
            class="bg-accented border-accented flex items-center justify-center rounded-2xl border p-8"
          >
            <ProgressCircular
              :progress="circularProgress / 100"
              :size="140"
              :stroke-width="10"
              show-percentage
            />
          </div>
        </div>
      </DemoSection>

      <!-- Surface -->
      <DemoSection
        title="Component Surface"
        description="Everything the UI layer composes from Visual"
      >
        <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in components"
            :key="item.name"
            class="bg-muted border-default rounded-2xl border p-6"
          >
            <UIcon :name="item.icon" class="text-primary mb-3 text-2xl" />
            <h3 class="text-highlighted mb-2 font-bold">{{ item.name }}</h3>
            <p class="text-muted text-sm">{{ item.description }}</p>
          </div>
        </div>
      </DemoSection>

      <DemoPageFooter
        name="Visual Layer"
        description="Gradients, tints, blobs, progress, and media"
        :links="[
          { label: 'Typography', to: '/typography', icon: 'i-lucide-type' },
          { label: 'Overlays', to: '/overlays', icon: 'i-lucide-layers' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
