<script setup lang="ts">
  import type { Component } from 'vue'

  definePageMeta({ ssr: false, layout: false })

  type Kind = 'generator' | 'filter' | 'uv'
  type Recipe = { kind: Kind; props?: Record<string, unknown>; texture?: boolean }

  // Blocks added from the shader-effects-inc/shaders port. Filters and UV blocks run over a shared
  // base (rings → cosine palette); generators replace the base. `texture` = adds a render-target pass.
  const recipes: Record<string, Recipe> = {
    Heart: { kind: 'generator' },
    Flower: { kind: 'generator', props: { petals: 8 } },
    Chevron: { kind: 'generator' },
    CarbonFiber: { kind: 'generator' },
    Ellipse: { kind: 'generator' },
    Spiral: { kind: 'generator' },
    SineWave: { kind: 'generator' },
    Truchet: { kind: 'generator' },
    Plasma: { kind: 'generator' },
    BrickPattern: { kind: 'generator' },
    Dither: { kind: 'filter', props: { levels: 4 } },
    CRTScreen: { kind: 'filter' },
    ContourLines: { kind: 'filter' },
    Solarize: { kind: 'filter' },
    Tritone: { kind: 'filter' },
    Heatmap: { kind: 'filter' },
    Scratches: { kind: 'filter' },
    Neon: { kind: 'filter', texture: true },
    Edge: { kind: 'filter', texture: true },
    Emboss: { kind: 'filter', texture: true },
    Frost: { kind: 'filter', texture: true },
    Blur: { kind: 'filter', texture: true },
    RadialBlur: { kind: 'filter', texture: true },
    Sharpness: { kind: 'filter', texture: true },
    Glow: { kind: 'filter', texture: true },
    TiltShift: { kind: 'filter', texture: true },
    LinearBlur: { kind: 'filter', texture: true },
    ChannelBlur: { kind: 'filter', texture: true },
    UVKaleidoscope: { kind: 'uv' },
    UVGlitch: { kind: 'uv' },
    UVMirror: { kind: 'uv' },
    UVPolar: { kind: 'uv' },
    UVStretch: { kind: 'uv' },
  }

  // Literal names so Nuxt's component auto-import can resolve each lazily (dynamic strings can't be)
  const blocks: Record<string, Component | string> = {
    Heart: resolveComponent('PipelineHeart'),
    Flower: resolveComponent('PipelineFlower'),
    Chevron: resolveComponent('PipelineChevron'),
    CarbonFiber: resolveComponent('PipelineCarbonFiber'),
    Ellipse: resolveComponent('PipelineEllipse'),
    Spiral: resolveComponent('PipelineSpiral'),
    SineWave: resolveComponent('PipelineSineWave'),
    Truchet: resolveComponent('PipelineTruchet'),
    Plasma: resolveComponent('PipelinePlasma'),
    BrickPattern: resolveComponent('PipelineBrickPattern'),
    Dither: resolveComponent('PipelineDither'),
    CRTScreen: resolveComponent('PipelineCRTScreen'),
    ContourLines: resolveComponent('PipelineContourLines'),
    Solarize: resolveComponent('PipelineSolarize'),
    Tritone: resolveComponent('PipelineTritone'),
    Heatmap: resolveComponent('PipelineHeatmap'),
    Scratches: resolveComponent('PipelineScratches'),
    Neon: resolveComponent('PipelineNeon'),
    Edge: resolveComponent('PipelineEdge'),
    Emboss: resolveComponent('PipelineEmboss'),
    Frost: resolveComponent('PipelineFrost'),
    Blur: resolveComponent('PipelineBlur'),
    RadialBlur: resolveComponent('PipelineRadialBlur'),
    Sharpness: resolveComponent('PipelineSharpness'),
    Glow: resolveComponent('PipelineGlow'),
    TiltShift: resolveComponent('PipelineTiltShift'),
    LinearBlur: resolveComponent('PipelineLinearBlur'),
    ChannelBlur: resolveComponent('PipelineChannelBlur'),
    UVKaleidoscope: resolveComponent('PipelineUVKaleidoscope'),
    UVGlitch: resolveComponent('PipelineUVGlitch'),
    UVMirror: resolveComponent('PipelineUVMirror'),
    UVPolar: resolveComponent('PipelineUVPolar'),
    UVStretch: resolveComponent('PipelineUVStretch'),
  }

  const names = Object.keys(recipes)
  const active = ref(names[0]!)
  const recipe = computed(() => recipes[active.value]!)
  const block = computed(() => blocks[active.value])
  const groups: { label: string; kind: Kind }[] = [
    { label: 'Generators', kind: 'generator' },
    { label: 'Filters', kind: 'filter' },
    { label: 'UV transforms', kind: 'uv' },
  ]
</script>

<template>
  <div class="text-highlighted flex min-h-screen flex-col bg-neutral-950">
    <div class="flex items-center gap-4 border-b border-white/8 px-6 py-4">
      <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" size="xs" color="neutral" />
      <div>
        <h1 class="text-sm font-semibold">Shader Pipeline — ported blocks</h1>
        <p class="text-highlighted/40 text-xs">
          {{ names.length }} blocks from shader-effects-inc/shaders · see docs/SHADER-PORT-LEFTOVERS.md
        </p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
      <div class="flex flex-1 items-start justify-center">
        <div
          class="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        >
          <ClientOnly>
            <ShaderPipelineContext>
              <div class="pointer-events-none hidden" aria-hidden="true">
                <!-- :key remounts the whole chain when the selection changes -->
                <template v-for="n in [active]" :key="n">
                  <template v-if="recipe.kind === 'generator'">
                    <component :is="block" :order="0" v-bind="recipe.props" />
                  </template>
                  <template v-else>
                    <PipelineRingField :order="0" />
                    <PipelineCosinePalette
                      :order="1"
                      scalar-source="prev"
                      :a="[0.5, 0.5, 0.5]"
                      :b="[0.5, 0.5, 0.5]"
                      :c="[1.0, 1.0, 1.0]"
                      :d="[0.0, 0.33, 0.67]"
                    />
                    <component :is="block" :order="2" v-bind="recipe.props" />
                  </template>
                </template>
              </div>

              <ShaderCanvas clear-color="#0a0a0a" :window-size="false" webgpu>
                <TresOrthographicCamera :args="[-1, 1, 1, -1, 0.1, 100]" :position="[0, 0, 1]" />
                <TresMesh>
                  <TresPlaneGeometry :args="[2, 2]" />
                  <ShaderPipeline />
                </TresMesh>
              </ShaderCanvas>
            </ShaderPipelineContext>
          </ClientOnly>
        </div>
      </div>

      <div class="w-full space-y-5 lg:w-72">
        <div v-for="g in groups" :key="g.kind">
          <p class="text-highlighted/40 mb-2 text-xs tracking-wide uppercase">{{ g.label }}</p>
          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="n in names.filter((x) => recipes[x]!.kind === g.kind)"
              :key="n"
              size="xs"
              color="neutral"
              :variant="active === n ? 'solid' : 'outline'"
              :label="n"
              @click="active = n"
            />
          </div>
        </div>
        <p v-if="recipe.texture" class="text-highlighted/50 text-xs">
          Source-texture block: adds a render-target pass.
        </p>
      </div>
    </div>
  </div>
</template>
