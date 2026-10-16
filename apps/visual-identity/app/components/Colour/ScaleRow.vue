<script setup lang="ts">
  import type { ScaleEntry } from '~/composables/useTailwindScale'

  const { name, scale, showOklch } = defineProps<{
    name: string
    scale: ScaleEntry[]
    showOklch?: boolean
  }>()
</script>

<template>
  <div>
    <p class="text-default mb-2 text-sm font-medium capitalize">{{ name }}</p>
    <div class="scale-grid">
      <div v-for="entry in scale" :key="entry.step" class="group relative">
        <div
          class="h-12 w-full cursor-pointer rounded-md border border-black/10 transition-transform hover:scale-105 dark:border-white/10"
          :style="{ backgroundColor: entry.hex }"
          :title="showOklch ? entry.oklchStr : entry.hex"
        />
        <div class="mt-1 text-center">
          <p class="text-muted font-mono text-[10px]">{{ entry.step }}</p>
          <p
            class="text-muted font-mono text-[9px] opacity-0 transition-opacity group-hover:opacity-100"
          >
            {{ showOklch ? entry.oklchStr.replace('oklch(', '').replace(')', '') : entry.hex }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
