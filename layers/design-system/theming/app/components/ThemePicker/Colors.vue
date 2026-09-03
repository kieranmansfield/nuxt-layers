<script setup lang="ts">
  import type { AccentColor } from '#layers/theming/app/types/theme'

  const appConfig = useAppConfig()
  const themeLayer = appConfig.themeLayer as { accents?: AccentColor[] } | undefined
  const { activeAccent, setAccent } = useAccentColor()

  const accents = computed<AccentColor[]>(() => themeLayer?.accents ?? [])
</script>

<template>
  <div class="grid grid-cols-6 gap-3">
    <ThemePickerAccentButton
      v-for="color in accents"
      :key="color"
      :color
      :active="activeAccent === color"
      @select="setAccent"
    />
  </div>
</template>
