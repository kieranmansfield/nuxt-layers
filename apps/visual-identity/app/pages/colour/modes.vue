<script setup lang="ts">
  import type { BackgroundStyle } from '~/composables/useBrandState'

  const { state } = useBrandState()

  const modeOptions = [
    { label: 'Light only', value: 'light-only', icon: 'i-lucide-sun' },
    { label: 'Dark only', value: 'dark-only', icon: 'i-lucide-moon' },
    { label: 'Both', value: 'both', icon: 'i-lucide-sun-moon' },
  ] as const

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
</script>

<template>
  <div class="vi-page">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-(--ui-text) mb-1">Light & Dark Modes</h1>
      <p class="text-(--ui-text-muted) text-sm">
        Configure which colour modes your brand supports and how backgrounds are styled.
      </p>
    </div>

    <!-- Mode selector -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-(--ui-text)">Supported modes</p>
      </template>
      <div class="flex gap-3">
        <button
          v-for="option in modeOptions"
          :key="option.value"
          class="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer"
          :class="
            state.themeMode.mode === option.value
              ? 'border-(--ui-primary) bg-(--ui-primary)/5'
              : 'border-(--ui-border) hover:border-(--ui-border-accented) hover:bg-(--ui-bg-elevated)'
          "
          @click="state.themeMode.mode = option.value"
        >
          <UIcon :name="option.icon" class="size-6 text-(--ui-text)" />
          <span class="text-sm font-medium text-(--ui-text)">{{ option.label }}</span>
        </button>
      </div>
    </UCard>

    <!-- Background style selector -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-(--ui-text)">Background style</p>
      </template>
      <div class="flex gap-3">
        <button
          v-for="option in bgOptions"
          :key="option.value"
          class="flex-1 flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer text-left"
          :class="
            state.themeMode.backgroundStyle === option.value
              ? 'border-(--ui-primary) bg-(--ui-primary)/5'
              : 'border-(--ui-border) hover:border-(--ui-border-accented) hover:bg-(--ui-bg-elevated)'
          "
          @click="state.themeMode.backgroundStyle = option.value"
        >
          <UIcon :name="option.icon" class="size-5 text-(--ui-text)" />
          <div>
            <p class="text-sm font-medium text-(--ui-text)">{{ option.label }}</p>
            <p class="text-xs text-(--ui-text-muted) mt-0.5 leading-snug">
              {{ option.description }}
            </p>
          </div>
        </button>
      </div>
    </UCard>

    <!-- Preview -->
    <UCard>
      <template #header>
        <p class="text-sm font-medium text-(--ui-text)">Preview</p>
      </template>
      <div
        v-if="state.colours.length === 0"
        class="text-center py-8 text-(--ui-text-muted) text-sm"
      >
        Add brand colours to see a preview.
      </div>
      <ColourModePreview
        v-else
        :colours="state.colours"
        :mode="state.themeMode.mode"
        :background-style="state.themeMode.backgroundStyle"
      />
    </UCard>
  </div>
</template>
