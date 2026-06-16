<script setup lang="ts">
  const appConfig = useAppConfig()
  const { activeAccent, setAccent } = useAccentColor()

  const accents = computed(() => appConfig.themeLayer?.accents ?? [])
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
