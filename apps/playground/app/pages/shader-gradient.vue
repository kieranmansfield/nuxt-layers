<script setup lang="ts">
import ThemeGradient from '#layers/shader/app/components/Preset/ThemeGradient.client.vue'
import ThemeWave from '#layers/shader/app/components/Preset/ThemeWave.client.vue'
import ThemeLavaLamp from '#layers/shader/app/components/Preset/ThemeLavaLamp.client.vue'
import ThemeBubble from '#layers/shader/app/components/Preset/ThemeBubble.client.vue'
import ThemePlasma from '#layers/shader/app/components/Preset/ThemePlasma.client.vue'
import type { AccentColor } from '#layers/theme/app/types/theme'

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
const PATTERNS: { key: PatternKey; label: string; component: any }[] = [
  { key: 'mesh',     label: 'Mesh',   component: ThemeGradient },
  { key: 'wave',     label: 'Wave',   component: ThemeWave },
  { key: 'lavalamp', label: 'Lava',   component: ThemeLavaLamp },
  { key: 'bubble',   label: 'Bubble', component: ThemeBubble },
  { key: 'plasma',   label: 'Plasma', component: ThemePlasma },
]
const activePattern = ref<PatternKey>('mesh')
const activePreset = computed(() => PATTERNS.find((p) => p.key === activePattern.value)!.component)

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

watch(primaryHex,    (hex) => { color1.value = hex }, { immediate: true })
watch(secondaryHex,  (hex) => { color2.value = hex }, { immediate: true })
watch(primaryLightHex, (hex) => { color3.value = hex }, { immediate: true })
watch(infoHex,       (hex) => { color4.value = hex }, { immediate: true })

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
const colorRefs = [color1, color2, color3, color4]

// Panel text/border adapts to color mode
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <ShaderRuntime>
    <ShaderHost
      :preset="activePreset"
      :preset-props="presetProps"
      :fixed="true"
      :z-index="-1"
      :clear-color="clearColor"
      tone-mapping="aces"
    />

    <div class="relative z-10 min-h-screen flex items-start justify-end p-6">
      <div
        class="w-72 space-y-5 rounded-2xl p-5 border text-sm"
        :class="
          isDark
            ? 'bg-black/50 backdrop-blur-lg border-white/10'
            : 'bg-white/70 backdrop-blur-lg border-black/10'
        "
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-semibold text-base" :class="isDark ? 'text-white' : 'text-black'">
              Theme Gradient
            </h1>
            <p class="text-xs mt-0.5" :class="isDark ? 'text-white/40' : 'text-black/40'">
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
            class="text-xs font-medium uppercase tracking-wide mb-2.5"
            :class="isDark ? 'text-white/40' : 'text-black/40'"
          >
            Pattern
          </p>
          <div class="flex gap-1.5">
            <button
              v-for="p in PATTERNS"
              :key="p.key"
              class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              :class="
                activePattern === p.key
                  ? isDark
                    ? 'bg-white/20 text-white'
                    : 'bg-black/15 text-black'
                  : isDark
                    ? 'bg-white/5 text-white/50 hover:text-white/80'
                    : 'bg-black/5 text-black/50 hover:text-black/80'
              "
              @click="activePattern = p.key"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- Accent preset -->
        <div>
          <p
            class="text-xs font-medium uppercase tracking-wide mb-2.5"
            :class="isDark ? 'text-white/40' : 'text-black/40'"
          >
            Accent preset
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="accent in accents"
              :key="accent"
              class="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-offset-transparent transition-all duration-150"
              :class="
                activeAccent === accent
                  ? 'ring-white scale-110'
                  : 'ring-transparent opacity-80 hover:opacity-100'
              "
              :style="{ backgroundColor: ACCENT_HEX[accent] }"
              :aria-label="accent"
              @click="setAccent(accent)"
            />
          </div>
        </div>

        <div class="h-px" :class="isDark ? 'bg-white/10' : 'bg-black/10'" />

        <!-- 4 colour pickers -->
        <div>
          <p
            class="text-xs font-medium uppercase tracking-wide mb-2.5"
            :class="isDark ? 'text-white/40' : 'text-black/40'"
          >
            Gradient colours
          </p>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="(label, i) in COLOR_LABELS"
              :key="label"
              class="flex items-center gap-2 cursor-pointer group"
            >
              <div
                class="relative w-7 h-7 rounded-lg overflow-hidden border shrink-0"
                :class="isDark ? 'border-white/20' : 'border-black/20'"
              >
                <input
                  v-model="colorRefs[i].value"
                  type="color"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="w-full h-full" :style="{ backgroundColor: colorRefs[i].value }" />
              </div>
              <span
                class="text-xs leading-none transition-colors"
                :class="
                  isDark
                    ? 'text-white/60 group-hover:text-white/90'
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
            class="text-xs font-medium uppercase tracking-wide"
            :class="isDark ? 'text-white/40' : 'text-black/40'"
          >
            Animation
          </p>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-xs" :class="isDark ? 'text-white/60' : 'text-black/60'">Speed</span>
              <span class="text-xs tabular-nums" :class="isDark ? 'text-white/40' : 'text-black/40'"
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
            <div class="flex justify-between mb-1">
              <span class="text-xs" :class="isDark ? 'text-white/60' : 'text-black/60'"
                >Intensity</span
              >
              <span
                class="text-xs tabular-nums"
                :class="isDark ? 'text-white/40' : 'text-black/40'"
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
              class="text-xs font-medium uppercase tracking-wide"
              :class="isDark ? 'text-white/40' : 'text-black/40'"
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
              @click="mouseInteraction = !mouseInteraction"
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
            <div class="flex justify-between mb-1">
              <span class="text-xs" :class="isDark ? 'text-white/60' : 'text-black/60'"
                >Strength</span
              >
              <span
                class="text-xs tabular-nums"
                :class="isDark ? 'text-white/40' : 'text-black/40'"
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
