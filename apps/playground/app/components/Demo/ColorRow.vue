<script setup lang="ts">
defineProps<{ label: string }>()
const model = defineModel<string>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-xs text-white/50 w-24 shrink-0 leading-none">{{ label }}</span>
    <label class="flex items-center gap-2 cursor-pointer">
      <div class="relative w-6 h-6 rounded overflow-hidden ring-1 ring-white/20 shrink-0">
        <input
          v-model="model"
          type="color"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div class="w-full h-full" :style="{ backgroundColor: model }" />
      </div>
      <span class="text-xs text-white/30 tabular-nums uppercase">{{ model }}</span>
    </label>
  </div>
</template>
