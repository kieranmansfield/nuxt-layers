<script setup lang="ts">
  import type { BackgroundStyle, ColourScheme, ContrastLevel } from '~/composables/useBrandState'

  const { state } = useBrandState()

  const schemeOptions: { label: string; value: ColourScheme; icon: string }[] = [
    { label: 'Light', value: 'light', icon: 'i-lucide-sun' },
    { label: 'Dark', value: 'dark', icon: 'i-lucide-moon' },
  ]

  const contrastOptions: {
    label: string
    value: ContrastLevel
    icon: string
    description: string
  }[] = [
    {
      label: 'Standard',
      value: 'standard',
      icon: 'i-lucide-circle-half-stroke',
      description: 'Balanced contrast for everyday reading.',
    },
    {
      label: 'High',
      value: 'high',
      icon: 'i-lucide-contrast',
      description: 'Maximum legibility — passes WCAG AAA.',
    },
  ]

  const bgOptions: { label: string; value: BackgroundStyle; description: string; icon: string }[] =
    [
      {
        label: 'Neutral',
        value: 'neutral',
        description: 'Pure white or dark grey — no colour influence on backgrounds.',
        icon: 'i-lucide-square',
      },
      {
        label: 'Tinted',
        value: 'tinted',
        description: 'A light hue of the primary colour washes the background.',
        icon: 'i-lucide-droplets',
      },
      {
        label: 'Blended',
        value: 'blended',
        description: 'A 50/50 mix of neutral and primary tint — subtle warmth.',
        icon: 'i-lucide-blend',
      },
    ]

  function toggleScheme(scheme: ColourScheme) {
    const current = state.value.themeMode.schemes
    if (current.includes(scheme)) {
      // Keep at least one scheme active
      if (current.length > 1) {
        state.value.themeMode.schemes = current.filter((s) => s !== scheme)
      }
    } else {
      state.value.themeMode.schemes = [...current, scheme]
    }
  }

  function toggleContrast(level: ContrastLevel) {
    const current = state.value.themeMode.contrastLevels
    if (current.includes(level)) {
      if (current.length > 1) {
        state.value.themeMode.contrastLevels = current.filter((c) => c !== level)
      }
    } else {
      state.value.themeMode.contrastLevels = [...current, level]
    }
  }

  const activeSchemes = computed(() => state.value.themeMode.schemes)
  const highContrastActive = computed(() => state.value.themeMode.contrastLevels.includes('high'))
</script>

<template>
  <div class="vi-page">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-default mb-1">Light & Dark Modes</h1>
      <p class="text-muted text-sm">
        Configure which colour schemes and contrast levels your brand supports.
      </p>
    </div>

    <!-- Colour schemes (multi-select) -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-default">Colour schemes</p>
      </template>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          v-for="option in schemeOptions"
          :key="option.value"
          class="flex-1 flex items-center sm:flex-col gap-3 sm:gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer text-left sm:text-center"
          :class="
            state.themeMode.schemes.includes(option.value)
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-accented hover:bg-elevated'
          "
          @click="toggleScheme(option.value)"
        >
          <UIcon :name="option.icon" class="size-5 sm:size-6 text-default shrink-0" />
          <span class="text-sm font-medium text-default">{{ option.label }}</span>
          <UIcon
            v-if="state.themeMode.schemes.includes(option.value)"
            name="i-lucide-check"
            class="size-4 text-primary ml-auto sm:ml-0"
          />
        </button>
      </div>
    </UCard>

    <!-- Contrast levels (multi-select) -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-default">Contrast levels</p>
      </template>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          v-for="option in contrastOptions"
          :key="option.value"
          class="flex-1 flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer text-left"
          :class="
            state.themeMode.contrastLevels.includes(option.value)
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-accented hover:bg-elevated'
          "
          @click="toggleContrast(option.value)"
        >
          <UIcon :name="option.icon" class="size-5 text-default shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-default">{{ option.label }}</p>
            <p class="text-xs text-muted mt-0.5 leading-snug">{{ option.description }}</p>
          </div>
          <UIcon
            v-if="state.themeMode.contrastLevels.includes(option.value)"
            name="i-lucide-check"
            class="size-4 text-primary shrink-0 mt-0.5"
          />
        </button>
      </div>
    </UCard>

    <!-- Background style -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-default">Background style</p>
      </template>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          v-for="option in bgOptions"
          :key="option.value"
          class="flex-1 flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer text-left"
          :class="
            state.themeMode.backgroundStyle === option.value
              ? 'border-primary bg-primary/5'
              : 'border-default hover:border-accented hover:bg-elevated'
          "
          @click="state.themeMode.backgroundStyle = option.value"
        >
          <UIcon :name="option.icon" class="size-5 text-default shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-default">{{ option.label }}</p>
            <p class="text-xs text-muted mt-0.5 leading-snug">{{ option.description }}</p>
          </div>
        </button>
      </div>
    </UCard>

    <!-- Standard preview -->
    <UCard class="mb-4">
      <template #header>
        <p class="text-sm font-medium text-default">Preview</p>
      </template>
      <div v-if="state.colours.length === 0" class="text-center py-8 text-muted text-sm">
        Add brand colours to see a preview.
      </div>
      <div
        v-else
        class="grid gap-3"
        :class="activeSchemes.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'"
      >
        <ColourModePreview
          v-for="scheme in activeSchemes"
          :key="scheme"
          :colours="state.colours"
          :scheme="scheme"
          contrast="standard"
          :background-style="state.themeMode.backgroundStyle"
        />
      </div>
    </UCard>

    <!-- High contrast preview — separate card, only shown when high is active -->
    <UCard v-if="state.colours.length > 0 && highContrastActive">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-contrast" class="size-4 text-muted" />
          <p class="text-sm font-medium text-default">High contrast</p>
        </div>
      </template>
      <div class="grid gap-3" :class="activeSchemes.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'">
        <ColourModePreview
          v-for="scheme in activeSchemes"
          :key="scheme"
          :colours="state.colours"
          :scheme="scheme"
          contrast="high"
          :background-style="state.themeMode.backgroundStyle"
        />
      </div>
    </UCard>
  </div>
</template>
