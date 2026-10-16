<script setup lang="ts">
  import type { PortfolioColor } from '../../types/content'

  const { colors = [] } = defineProps<{
    colors?: PortfolioColor[]
  }>()

  function contrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'
  }
</script>

<template>
  <div v-if="colors.length" class="space-y-6">
    <h3 class="text-highlighted text-2xl font-semibold tracking-tight">Palette</h3>
    <LinksGroup class="palette-grid gap-3">
      <div v-for="color in colors" :key="color.value">
        <div
          class="border-default/20 flex aspect-2/3 cursor-default flex-col justify-between rounded-lg border p-4 shadow-lg"
          :style="{ backgroundColor: color.value, color: contrastColor(color.value) }"
        >
          <div>
            <p class="text-sm leading-tight font-medium">{{ color.name }}</p>
            <p v-if="color.usage" class="mt-1 text-xs opacity-60">{{ color.usage }}</p>
          </div>
          <p class="font-mono text-xs uppercase opacity-50">{{ color.value }}</p>
        </div>
      </div>
    </LinksGroup>
  </div>
</template>

<style scoped>
  .palette-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
</style>
