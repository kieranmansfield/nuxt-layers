<script setup lang="ts">
import type { ScaleEntry } from '~/composables/useTailwindScale'

defineProps<{
  name: string
  scale: ScaleEntry[]
  showOklch?: boolean
}>()
</script>

<template>
  <div>
    <p class="text-sm font-medium text-default mb-2 capitalize">{{ name }}</p>
    <div class="scale-grid">
      <div
        v-for="entry in scale"
        :key="entry.step"
        class="group relative"
      >
        <div
          class="h-12 w-full rounded-md border border-black/10 dark:border-white/10 cursor-pointer transition-transform hover:scale-105"
          :style="{ backgroundColor: entry.hex }"
          :title="showOklch ? entry.oklchStr : entry.hex"
        />
        <div class="text-center mt-1">
          <p class="text-[10px] text-muted font-mono">{{ entry.step }}</p>
          <p class="text-[9px] text-muted font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {{ showOklch ? entry.oklchStr.replace('oklch(', '').replace(')', '') : entry.hex }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
