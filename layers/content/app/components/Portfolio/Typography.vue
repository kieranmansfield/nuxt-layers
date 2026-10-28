<script setup lang="ts">
  import type { PortfolioFont } from '../../types/content'

  const { typography = [] } = defineProps<{
    typography?: PortfolioFont[]
  }>()

  // Nothing validates frontmatter (collections have no schema), so `weights: 400` or
  // `weights: 400 700` arrive as a number or string — and `v-for` over 400 renders 400 spans
  function weightList(weights: unknown): string[] {
    if (Array.isArray(weights)) return weights.map(String)
    if (weights === undefined || weights === null) return []
    return String(weights)
      .split(/[\s,]+/)
      .filter(Boolean)
  }
</script>

<template>
  <div v-if="typography.length" class="space-y-6">
    <h3 class="text-highlighted text-2xl font-semibold tracking-tight">Typography</h3>
    <div class="mt-8 flex flex-col gap-24">
      <div v-for="font in typography" :key="font.name" class="flex flex-col gap-6">
        <div class="flex items-baseline justify-between gap-4">
          <p class="font-name text-highlighted truncate font-semibold tracking-tight">
            {{ font.name }}
          </p>
          <p v-if="font.usage" class="text-muted shrink-0 text-sm">{{ font.usage }}</p>
        </div>
        <p class="font-sample text-muted tracking-wide">ABCDEFGHabcdefgh 0123456789</p>
        <div class="flex flex-wrap items-center gap-4">
          <span class="text-muted font-mono text-xs tracking-widest uppercase opacity-50">
            Weights
          </span>
          <span
            v-for="weight in weightList(font.weights)"
            :key="weight"
            class="text-muted font-mono text-xs tracking-widest uppercase"
          >
            {{ weight }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .font-name {
    font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
  }

  .font-sample {
    font-size: clamp(1.5rem, 1.25rem + 1.5vw, 2.5rem);
  }
</style>
