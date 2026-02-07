<script setup lang="ts">
import type { AccentColor } from '#layers/theme/app/types/theme'

const appConfig = useAppConfig()
const { activeAccent, setAccent } = useThemePreferences()

const accents = computed(
  () => (appConfig as any).themeLayer?.accents as AccentColor[] ?? [],
)
</script>

<template>
  <div class="grid grid-cols-6 gap-3">
    <ThemePickerAccentButton
      v-for="color in accents"
      :key="color"
      :color="color"
      :active="activeAccent === color"
      @select="setAccent"
    />
  </div>
</template>
