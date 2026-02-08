<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import type { PortfolioFont } from '../../types/content'

const { typography = [] } = defineProps<{
  typography?: PortfolioFont[]
}>()
</script>

<template>
  <div v-if="typography.length" class="space-y-6">
    <h3 class="text-2xl font-semibold tracking-tight text-highlighted">Typography</h3>
    <div class="mt-8 flex flex-col gap-24">
      <div v-for="font in typography" :key="font.name" class="flex flex-col gap-6">
        <div class="flex items-baseline justify-between gap-4">
          <p class="text-4xl sm:text-5xl font-semibold text-highlighted tracking-tight truncate">
            {{ font.name }}
          </p>
          <p v-if="font.usage" class="text-sm text-muted shrink-0">{{ font.usage }}</p>
        </div>
        <p class="text-2xl sm:text-3xl text-muted tracking-wide">ABCDEFGHabcdefgh 0123456789</p>
        <div class="flex items-center gap-4">
          <span class="text-xs font-mono text-muted uppercase tracking-widest opacity-50">
            Weights
          </span>
          <span
            v-for="weight in font.weights"
            :key="weight"
            class="text-xs font-mono text-muted uppercase tracking-widest"
          >
            {{ weight }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
