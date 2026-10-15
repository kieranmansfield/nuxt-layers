<script setup lang="ts">
  const { label } = defineProps<{ label: string }>()
  const model = defineModel<string>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-highlighted/50 w-24 shrink-0 text-xs leading-none">{{ label }}</span>
    <label class="flex cursor-pointer items-center gap-2">
      <div class="relative h-6 w-6 shrink-0 overflow-hidden rounded ring-1 ring-white/20">
        <input
          v-model="model"
          type="color"
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div class="h-full w-full" :style="{ backgroundColor: model }" />
      </div>
      <span class="text-highlighted/30 text-xs uppercase tabular-nums">{{ model }}</span>
    </label>
  </div>
</template>
