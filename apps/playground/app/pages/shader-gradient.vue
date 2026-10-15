<script setup lang="ts">
  import type { Component } from 'vue'
  import ThemeBubble from '#layers/shader/app/components/Preset/ThemeBubble.client.vue'
  import ThemeGradient from '#layers/shader/app/components/Preset/ThemeGradient.client.vue'
  import ThemeLavaLamp from '#layers/shader/app/components/Preset/ThemeLavaLamp.client.vue'
  import ThemePlasma from '#layers/shader/app/components/Preset/ThemePlasma.client.vue'
  import ThemeWave from '#layers/shader/app/components/Preset/ThemeWave.client.vue'
  import type { AccentColor } from '#layers/theming/app/types/theme'

  definePageMeta({ ssr: false, layout: false })

  // Hardcoded Tailwind 500 hex values (same as ThemePickerAccentButton)
  const ACCENT_HEX: Record<AccentColor, string> = {
    red: '#ef4444',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    lime: '#84cc16',
    green: '#22c55e',
    emerald: '#10b981',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    sky: '#0ea5e9',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    fuchsia: '#d946ef',
    pink: '#ec4899',
    rose: '#f43f5e',
  }

  const accents = Object.keys(ACCENT_HEX) as AccentColor[]

  // Pattern selector
  type PatternKey = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'
  const PATTERNS: { key: PatternKey; label: string; component: Component }[] = [
    { key: 'mesh', label: 'Mesh', component: ThemeGradient },
    { key: 'wave', label: 'Wave', component: ThemeWave },
    { key: 'lavalamp', label: 'Lava', component: ThemeLavaLamp },
    { key: 'bubble', label: 'Bubble', component: ThemeBubble },
    { key: 'plasma', label: 'Plasma', component: ThemePlasma },
  ]
  const activePattern = ref<PatternKey>('mesh')
  const activePreset = computed(
    () => PATTERNS.find((p) => p.key === activePattern.value)!.component
  )

  // Controls
  const speed = ref(1.0)
  const intensity = ref(1.0)
  const mouseInteraction = ref(true)
  const mouseStrength = ref(0.3)

  // 4 gradient point colours — start at violet theme defaults
  const color1 = ref('#8b5cf6')
  const color2 = ref('#6366f1')
  const color3 = ref('#a78bfa')
  const color4 = ref('#38bdf8')

  // Sync to theme accent + color mode
  const { setAccent, activeAccent } = useAccentColor()
  const { primaryHex, secondaryHex, infoHex, primaryLightHex, clearColor } = useThemeColors()

  watch(
    primaryHex,
    (hex) => {
      color1.value = hex
    },
    { immediate: true }
  )
  watch(
    secondaryHex,
    (hex) => {
      color2.value = hex
    },
    { immediate: true }
  )
  watch(
    primaryLightHex,
    (hex) => {
      color3.value = hex
    },
    { immediate: true }
  )
  watch(
    infoHex,
    (hex) => {
      color4.value = hex
    },
    { immediate: true }
  )

  const presetProps = computed(() => ({
    speed: speed.value,
    intensity: intensity.value,
    mouseInteraction: mouseInteraction.value,
    mouseStrength: mouseStrength.value,
    color1: color1.value,
    color2: color2.value,
    color3: color3.value,
    color4: color4.value,
  }))

  const COLOR_LABELS = ['Point 1', 'Point 2', 'Point 3', 'Point 4'] as const
  const colorRefs = [color1, color2, color3, color4] as [
    typeof color1,
    typeof color1,
    typeof color1,
    typeof color1,
  ]

  // Panel text/border adapts to color mode
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <ShaderRuntime>
    <ShaderHost
      :preset="activePreset"
      :preset-props
      fixed
      :z-index="0"
      :clear-color
      tone-mapping="aces"
    />

    <div class="relative z-10 flex min-h-screen items-start justify-end p-6">
      <div
        class="w-72 space-y-5 rounded-2xl border p-5 text-sm"
        :class="
          isDark
            ? 'border-white/10 bg-black/50 backdrop-blur-lg'
            : 'border-black/10 bg-white/70 backdrop-blur-lg'
        "
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-base font-semibold" :class="isDark ? 'text-highlighted' : 'text-black'">
              Theme Gradient
            </h1>
            <p class="mt-0.5 text-xs" :class="isDark ? 'text-highlighted/40' : 'text-black/40'">
              Animated mesh — TSL / WebGPU
            </p>
          </div>
          <div class="flex items-center gap-1.5">
            <UColorModeSelect size="xs" />
            <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" size="xs" color="neutral" />
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- Pattern selector -->
        <div>
          <p
            class="mb-2.5 text-xs font-medium tracking-wide uppercase"
            :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
          >
            Pattern
          </p>
          <div class="flex gap-1.5">
            <button
              v-for="p in PATTERNS"
              :key="p.key"
              class="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150"
              :class="
                activePattern === p.key
                  ? isDark
                    ? 'text-highlighted bg-white/20'
                    : 'bg-black/15 text-black'
                  : isDark
                    ? 'text-highlighted/50 hover:text-highlighted/80 bg-white/5'
                    : 'bg-black/5 text-black/50 hover:text-black/80'
              "
              @click="() => (activePattern = p.key)"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- Accent preset -->
        <div>
          <p
            class="mb-2.5 text-xs font-medium tracking-wide uppercase"
            :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
          >
            Accent preset
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="accent in accents"
              :key="accent"
              class="h-5 w-5 rounded-full ring-1 ring-offset-1 ring-offset-transparent transition-all duration-150"
              :class="
                activeAccent === accent
                  ? 'scale-110 ring-white'
                  : 'opacity-80 ring-transparent hover:opacity-100'
              "
              :style="{ backgroundColor: ACCENT_HEX[accent] }"
              :aria-label="accent"
              @click="() => setAccent(accent)"
            />
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- 4 colour pickers -->
        <div>
          <p
            class="mb-2.5 text-xs font-medium tracking-wide uppercase"
            :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
          >
            Gradient colours
          </p>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="(label, i) in COLOR_LABELS"
              :key="label"
              class="group flex cursor-pointer items-center gap-2"
            >
              <div
                class="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg border"
                :class="isDark ? 'border-white/20' : 'border-black/20'"
              >
                <input
                  v-model="colorRefs[i]!.value"
                  type="color"
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div class="h-full w-full" :style="{ backgroundColor: colorRefs[i]!.value }" />
              </div>
              <span
                class="text-xs leading-none transition-colors"
                :class="
                  isDark
                    ? 'text-highlighted/60 group-hover:text-highlighted/90'
                    : 'text-black/60 group-hover:text-black/90'
                "
              >
                {{ label }}
              </span>
            </label>
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- Animation -->
        <div class="space-y-3">
          <p
            class="text-xs font-medium tracking-wide uppercase"
            :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
          >
            Animation
          </p>

          <div>
            <div class="mb-1 flex justify-between">
              <span class="text-xs" :class="isDark ? 'text-highlighted/60' : 'text-black/60'"
                >Speed</span
              >
              <span
                class="text-xs tabular-nums"
                :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
                >{{ speed.toFixed(1) }}×</span
              >
            </div>
            <input
              v-model.number="speed"
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              class="w-full"
              :class="isDark ? 'accent-white' : 'accent-black'"
            />
          </div>

          <div>
            <div class="mb-1 flex justify-between">
              <span class="text-xs" :class="isDark ? 'text-highlighted/60' : 'text-black/60'"
                >Intensity</span
              >
              <span
                class="text-xs tabular-nums"
                :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
                >{{ intensity.toFixed(1) }}</span
              >
            </div>
            <input
              v-model.number="intensity"
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              class="w-full"
              :class="isDark ? 'accent-white' : 'accent-black'"
            />
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- Mouse interaction -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <p
              class="text-xs font-medium tracking-wide uppercase"
              :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
            >
              Mouse
            </p>
            <button
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200"
              :class="
                mouseInteraction
                  ? isDark
                    ? 'bg-white/80'
                    : 'bg-black/70'
                  : isDark
                    ? 'bg-white/20'
                    : 'bg-black/20'
              "
              @click="() => (mouseInteraction = !mouseInteraction)"
            >
              <span
                class="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
                :class="[
                  mouseInteraction ? 'translate-x-4' : 'translate-x-1',
                  isDark ? 'bg-black' : 'bg-white',
                ]"
              />
            </button>
          </div>

          <div v-if="mouseInteraction">
            <div class="mb-1 flex justify-between">
              <span class="text-xs" :class="isDark ? 'text-highlighted/60' : 'text-black/60'"
                >Strength</span
              >
              <span
                class="text-xs tabular-nums"
                :class="isDark ? 'text-highlighted/40' : 'text-black/40'"
                >{{ mouseStrength.toFixed(2) }}</span
              >
            </div>
            <input
              v-model.number="mouseStrength"
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              class="w-full"
              :class="isDark ? 'accent-white' : 'accent-black'"
            />
          </div>
        </div>
      </div>
    </div>
  </ShaderRuntime>
</template>
