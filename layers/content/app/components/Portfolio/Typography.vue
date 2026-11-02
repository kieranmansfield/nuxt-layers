<script setup lang="ts">
import type { PortfolioFont } from "../../types/content";

const { typography = [] } = defineProps<{
  typography?: PortfolioFont[];
}>();

// Nothing validates frontmatter (collections have no schema), so `weights: 400` or
// `weights: 400 700` arrive as a number or string — and `v-for` over 400 renders 400 spans
function weightList(weights: unknown): string[] {
  if (Array.isArray(weights)) return weights.map(String);
  if (weights === undefined || weights === null) return [];
  return String(weights)
    .split(/[\s,]+/)
    .filter(Boolean);
}
</script>

<template>
  <div v-if="typography.length" class="space-y-6">
    <h3 class="text-highlighted text-2xl font-semibold tracking-tight">Typography</h3>
    <div class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="font in typography"
        :key="font.name"
        class="border-default/20 flex flex-col gap-6 rounded-lg border p-6"
        :style="{ fontFamily: `'${font.name}', inherit` }"
      >
        <p class="font-aa text-highlighted leading-none">Aa</p>
        <div>
          <p class="text-highlighted text-lg font-semibold tracking-tight">{{ font.name }}</p>
          <p v-if="font.usage" class="text-muted text-sm">{{ font.usage }}</p>
        </div>
        <div class="text-muted space-y-1 text-xl tracking-wide">
          <p>ABCDEFGH</p>
          <p>abcdefgh</p>
          <p>0123456789</p>
        </div>
        <div v-if="weightList(font.weights).length" class="flex flex-wrap items-center gap-4">
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
.font-aa {
  font-size: clamp(5rem, 4rem + 5vw, 8rem);
}
</style>
