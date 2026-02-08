<!-- eslint-disable vue/require-default-prop -->
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
    <h3 class="text-2xl font-semibold tracking-tight text-highlighted">Palette</h3>
    <LinksGroup class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      <div
        v-for="color in colors"
        :key="color.value"
      >
        <div
          class="aspect-2/3 flex flex-col justify-between p-4 rounded-lg border border-default/20 shadow-lg cursor-default"
          :style="{ backgroundColor: color.value, color: contrastColor(color.value) }"
        >
          <div>
            <p class="text-sm font-medium leading-tight">{{ color.name }}</p>
            <p v-if="color.usage" class="text-xs mt-1 opacity-60">{{ color.usage }}</p>
          </div>
          <p class="text-xs font-mono uppercase opacity-50">{{ color.value }}</p>
        </div>
      </div>
    </LinksGroup>
  </div>
</template>
