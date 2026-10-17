<script setup lang="ts">
  import * as Fx from 'shaders/vue'

  definePageMeta({ ssr: false, layout: false })

  // Effects layered over a base gradient. Defaults only — see https://shaders.com for props.
  // Imported as a namespace so the demo can switch effects at runtime; real apps should import by name.
  const effects = [
    'Aurora',
    'Glass',
    'FlutedGlass',
    'Frost',
    'Halftone',
    'Ascii',
    'CRTScreen',
    'Glitch',
    'Kaleidoscope',
    'Godrays',
    'Hologram',
    'Crystal',
    'CursorTrail',
    'CursorRipples',
  ] as const
  type EffectName = (typeof effects)[number]

  const active = ref<EffectName>('Aurora')
  const effect = computed(() => Fx[active.value])
  const showGrain = ref(true)

  const { supported } = useEffectsSupport()
</script>

<template>
  <div class="text-highlighted flex min-h-screen flex-col bg-neutral-950">
    <div class="flex items-center gap-4 border-b border-white/8 px-6 py-4">
      <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" size="xs" color="neutral" />
      <div>
        <h1 class="text-sm font-semibold">Effects layer — shaders (WGSL / WebGPU)</h1>
        <p class="text-highlighted/40 text-xs">
          WebGPU {{ supported ? 'available' : 'unavailable' }} · telemetry
          {{ useAppConfig().effects?.telemetry ? 'on' : 'off' }}
        </p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
      <div class="flex-1">
        <FxShader class="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Fx.LinearGradient color-a="#0f172a" color-b="#7c3aed" />
          <component :is="effect" :key="active" />
          <Fx.FilmGrain v-if="showGrain" />
          <template #fallback>
            <div class="flex aspect-video items-center justify-center rounded-2xl bg-white/5">
              <p class="text-sm opacity-70">WebGPU is not available in this browser.</p>
            </div>
          </template>
        </FxShader>
      </div>

      <div class="w-full space-y-4 lg:w-72">
        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="n in effects"
            :key="n"
            size="xs"
            color="neutral"
            :variant="active === n ? 'solid' : 'outline'"
            :label="n"
            @click="active = n"
          />
        </div>
        <USwitch v-model="showGrain" label="Film grain overlay" />
      </div>
    </div>
  </div>
</template>
